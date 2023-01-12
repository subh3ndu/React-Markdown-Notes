import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { data } from './data';
import Split from 'react-split';
import { nanoid } from 'nanoid';

export default function App() {
    // lazy initializtion
    const [notes, setNotes] = React.useState(
        () => JSON.parse(localStorage.getItem('notes')) || []
    );
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ''
    );

    React.useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: '# Untitled',
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        setNotes((oldNotes) => {
            const arr = [];
            oldNotes.forEach((oldNote) => {
                oldNote.id === currentNoteId
                    ? arr.unshift({ ...oldNote, body: text })
                    : arr.push(oldNote);
            });
            return arr;
        });
    }

    function deleteNote(event, noteId) {
        event.stopPropagation();
        setNotes((oldNotes) =>
            oldNotes.filter((oldNote) => oldNote.id !== noteId)
        );
    }

    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId;
            }) || notes[0]
        );
    }

    return (
        <main>
            {notes.length > 0 ? (
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={notes}
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor
                            currentNote={findCurrentNote()}
                            updateNote={updateNote}
                        />
                    )}
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
