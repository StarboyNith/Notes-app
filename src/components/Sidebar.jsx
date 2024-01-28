import React, { useState } from "react";
import { useAuth } from "../AuthContexts";
import Profile from "../assets/profile.png"
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar(props) {
  const navigate = useNavigate()
  
  const [error, setError] = React.useState("");
  const {toogleNavbar,navVisible,handleLogOut,currentUser,logOut }  = useAuth()
  
  

 
  const noteElements = props.notes.map((note, index) => (
    <div key={note.id} className="note-container">
      <div
        className={`title ${
          note.id === props.currentNote?.id ? "selected-note" : ""
        }`}
        onClick={() => props.setCurrentNoteId(note.id)}
      >
        <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
        <button
          className="delete-btn"
          onClick={() => props.deleteNote(note.id)}
        >
          <i className="gg-trash trash-icon"></i>
        </button>
      </div>
    </div>
  ));


  return (
    <>
     {navVisible && <nav className="nav-bar" >
        <img className="nav-profile-icon" src={Profile} alt="" />
        <h6 className="user-name">{currentUser?.email}</h6>
        {/* <Link to="/updateprofile">
          </Link> */}
          <button className="update-btn" onClick={ ()=>navigate("/updateprofile")}>Update Profile</button>
        
        <button className="logout-btn" onClick={handleLogOut}>
          LogOut{" "}
        </button>
        <button className="logout-btn" onClick={toogleNavbar}>
          Back{" "}
        </button>
      </nav>}

      <section className="pane sidebar">
        <div className="sidebar--header">
          <button className="profile" onClick={toogleNavbar}>
            <img className="profile-icon" src={Profile} alt="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Dprofile&psig=AOvVaw1tXgy5UnieKRBv1NLaddcR&ust=1706531046720000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJjDsuGJgIQDFQAAAAAdAAAAABAD" />
          </button>

          <h3>Notes</h3>
          <button className="new-note" onClick={props.newNote}>
            +
          </button>
        </div>
        {noteElements}
      </section>
    </>
  );
}

