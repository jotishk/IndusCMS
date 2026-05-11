"use client";

import { useState,useEffect } from "react";
import styles from "./page.module.css";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'


export default function Home() {
  useEffect(() => {
    document.title = "IndUS CMS - Event Management";
  }, []);
  const initialEvents = [
    {
      id: 1,
      title: "Summer Gala",
      date: "2026-06-20",
      location: "Mumbai Club",
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Product Launch",
      date: "2026-07-01",
      location: "Online Webinar",
      status: "Planned",
    },
    {
      id: 3,
      title: "Team Retreat",
      date: "2026-05-28",
      location: "Goa Resort",
      status: "Published",
    },
  ];

  const blankForm = {
    title: "",
    date: "",
    location: "",
    status: "Upcoming",
  };

  const [events, setEvents] = useState(initialEvents);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.date.trim()) {
      return;
    }

    if (editingId) {
      setEvents((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
    } else {
      const newEvent = {
        id: Date.now(),
        ...form,
      };
      setEvents((current) => [newEvent, ...current]);
    }

    resetForm();
  };

  const handleEdit = (eventData) => {
    setEditingId(eventData.id);
    setForm({
      title: eventData.title,
      date: eventData.date,
      location: eventData.location,
      status: eventData.status,
    });
  };

  const handleDelete = (id) => {
    setEvents((current) => current.filter((eventItem) => eventItem.id !== id));
    if (editingId === id) {
      resetForm();
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
                className = {styles.input}
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Event title"
              />
            </label>

            <label className={styles.formField}>
              <span>Date</span>
              <input
                className = {styles.input}

                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </label>

            <label className={styles.formField}>
              <span>Content</span>
              <EventEditor />
              {/* <input
                className = {styles.input}

                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
              /> */}
            </label>

            <label className={styles.formField}>
              <span>Status</span>
              <select className={styles.input} name="status" value={form.status} onChange={handleChange}>
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
            <p className={styles.emptyState}>No events available. Add an event to get started.</p>
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
                    <td>{eventItem.date}</td>
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

function EventEditor() {
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
      
    ],
    content: '<p>Start writing your event...</p>',
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className = {styles.eventeditor}>
      
      {/* Toolbar */}
      <div style={{ marginBottom: '10px', display: 'flex' , flexWrap: 'wrap' }}>
        
        <button className={styles.toolbarButton} onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button className={styles.toolbarButton} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button className={styles.toolbarButton} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </button>

        <button className={styles.toolbarButton} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet List
        </button>

        <button className={styles.toolbarButton} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Numbered List
        </button>
        <button className={styles.toolbarButton} onClick={() => editor.chain().focus().clearContent(true).run()}>
          Clear
        </button>
      </div>

      
      <EditorContent  className={styles.editor} editor={editor} />
      
    </div>
  )
}
