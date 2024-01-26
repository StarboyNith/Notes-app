import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import Split from "react-split";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { noteCollection, db } from "../firebase";
import { useAuth } from "../AuthContexts";
import { collection } from "firebase/firestore";
import Updateprofile from "./Updateprofile";

export default function Dashboard() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");
  const { currentUser, toogleNavbar, navVisible, handleLogOut,toggleUpdate,update } = useAuth();
  
  
  

  useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  React.useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote?.body) {
        updateNote(tempNoteText);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  useEffect(() => {
    const userNotesCollectionRef = collection(
      db,
      "users",
      currentUser.uid,
      "notes"
    );

    const unsubscribe = onSnapshot(userNotesCollectionRef, (snapshot) => {
      const notesArr = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setNotes(notesArr);
    });

    return unsubscribe;
  }, [currentUser]);

  async function createNewNote() {
    try {
      // Check if the user's collection exists
      const userCollectionRef = doc(db, "users", currentUser.uid);
      const userCollectionSnapshot = await getDoc(userCollectionRef);

      if (!userCollectionSnapshot.exists()) {
        // If the user's collection doesn't exist, create it
        await setDoc(userCollectionRef, {});
      }

      // Create a new note document inside the user's collection
      const noteCollectionRef = collection(userCollectionRef, "notes");
      const newNote = {
        body: "# Type your markdown note's title here",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const docRef = await addDoc(noteCollectionRef, newNote);

      setCurrentNoteId(docRef.id);
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  }

  async function createCollection() {
    try {
      if (currentUser) {
        // Replace 'users' with your actual collection name if needed
        const userCollectionName = `notes_${currentUser.uid}`;
        const userNoteCollection = collection(db, userCollectionName);

        // Check if there are any documents in the collection
        const querySnapshot = await getDocs(userNoteCollection);

        if (querySnapshot.empty) {
          // Collection is empty, create a new document
          await createNewNote();
        } else {
          // Collection is not empty, you may choose to do something else
          console.log("Collection already has documents");
        }
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  }

  async function updateNote(text) {
    try {
      if (currentNoteId) {
        const noteCollectionRef = collection(
          db,
          "users",
          currentUser.uid,
          "notes"
        );
        const docRef = doc(noteCollectionRef, currentNoteId);

        // Update the note document
        await setDoc(
          docRef,
          { body: text, updatedAt: Date.now() },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  const sortedNotes = notes.sort((a, b) => {
    return b.updatedAt - a.updatedAt;
  });

  async function deleteNote(noteId) {
    try {
      if (noteId) {
        const noteCollectionRef = collection(
          db,
          "users",
          currentUser.uid,
          "notes"
        );
        const docRef = doc(noteCollectionRef, noteId);

        // Delete the note document
        await deleteDoc(docRef);

        // Check if there are any documents left in the user's collection
        const querySnapshot = await getDocs(noteCollectionRef);

        if (querySnapshot.empty) {
          // If no documents left, delete the entire user's collection
          const userCollectionRef = doc(db, "users", currentUser.uid);
          await deleteDoc(userCollectionRef);
        }
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split
        sizes={[16, 84]}
        minSize={225}
        // maxSize={500}
        direction="horizontal"
        className="split"
        >
          
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
            currentUser={currentUser}
          />
          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
          />
        </Split>
       
      ) : (
        <div className="no-notes">
          {/* navbar */}
          {navVisible && (
  <nav className="nav-bar" style={{ border: "none" }}>
    <img className="nav-profile-icon" src="../profile.png" alt="" />
    <h6 className="user-name">{currentUser?.email}</h6>
    <button className="update-btn" onClick={() => console.log("Button clicked")}>
  Update Profile
</button>

    <button className="logout-btn" onClick={handleLogOut}>
      LogOut{" "}
    </button>
    <button className="logout-btn" onClick={toogleNavbar}>
      Back{" "}
    </button>
  </nav>
)}

         

          <button className="profile" onClick={toogleNavbar}>
            <img className="new-pro-icon" src="../profile.png" alt="" />
          </button>
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createCollection}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
