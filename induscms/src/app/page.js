"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function Home() {
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();

        const updated = data.map((item) => ({
          ...item,
          date: item.date_posted,
          status: "Published",
        }));
        setEvents(updated);
      } catch (err) {
        console.error(err);
      }
    }

    fetchEvents();
  }, []);

  const blankForm = {
    title: "",
    time: "",
    date: "",
    thumbnail: "",
    content: "",
    location: "",

    status: "Upcoming",
  };

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setForm(blankForm);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    try {
      if (editingId) {
        await fetch(`/api/events/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        setEvents((current) =>
          current.map((item) =>
            item.id === editingId ? { ...item, ...form } : item,
          ),
        );
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        const newEvent = {
          ...form,
          id: data.id,
        };

        setEvents((current) => [newEvent, ...current]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (eventData) => {
    setEditingId(eventData.id);
    setForm({
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      thumbnail: eventData.thumbnail,
      location: eventData.location,
      content: eventData.content,
      status: eventData.status,
    });
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      thumbnail: data.url,
    }));
  };
  const handleDelete = async (id) => {
    try {
      await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setEvents((current) =>
        current.filter((eventItem) => eventItem.id !== id),
      );

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.smallHeading}>IndUS Admin Portal</p>
          <h1>Event Content Management</h1>
          <p className={styles.subtitle}>
            View, add, edit, and delete events from your CMS.
          </p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>{editingId ? "Edit Event" : "Add Event"}</h2>
          <p>Use the form to create new events or update an existing row.</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.formField}>
              <span>Title</span>
              <input
                className={styles.input}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Event title"
              />
            </label>
            <label className={styles.formField}>
              <span>Thumbnail</span>
              <input
                className={styles.input}
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            <label className={styles.formField}>
              <span>Date</span>
              <input
                className={styles.input}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>
            <label className={styles.formField}>
              <span>Time</span>
              <input
                className={styles.input}
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </label>

            <label className={styles.formField}>
              <span>Content</span>
              <EventEditor
                value={form.content}
                onChange={(html) =>
                  setForm((prev) => ({ ...prev, content: html }))
                }
              />
            </label>

            <label className={styles.formField}>
              <span>Status</span>
              <select
                className={styles.input}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Unpublished</option>
                <option>Published</option>
                <option>Past Event</option>
              </select>
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>
              {editingId ? "Save Changes" : "Add Event"}
            </button>
            {editingId && (
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2>Events</h2>
          <p>Manage your current event list.</p>
        </div>

        <div className={styles.tableWrapper}>
          {events.length === 0 ? (
            <p className={styles.emptyState}>
              No events available. Add an event to get started.
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((eventItem) => (
                  <tr key={eventItem.id}>
                    <td>{eventItem.title}</td>
                    <td>
                      {new Intl.DateTimeFormat("en-US", {
                        timeZone: "UTC",
                      }).format(new Date(eventItem.date))}
                    </td>
                    <td>{eventItem.status}</td>
                    <td className={styles.actionsCell}>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => handleEdit(eventItem)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => handleDelete(eventItem.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function EventEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {},
        orderedList: {},
        listItem: {},
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value || "<p>Start writing...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();

    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);
  if (!editor) return null;

  return (
    <div className={styles.eventeditor}>
     
      <div style={{ gap:"2px", marginBottom: "10px", display: "flex", flexWrap: "wrap" }}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet List
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered List
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => document.getElementById("editorImageUpload").click()}
        >
          Insert Image
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={() => editor.chain().focus().clearContent(true).run()}
        >
          Clear
        </button>
      </div>

      <input
        id="editorImageUpload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !editor) return;

          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          editor
            .chain()
            .focus()
            .insertContent({
              type: "image",
              attrs: {
                src: `https://indusfoxvalley.org/${data.url}`,
              },
            })
            .run();
        }}
      />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  );
}
