import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  convertFromRaw,
  convertToRaw,
} from "draft-js";

import Title from "./Title";
import Button from "./Button";

import "../App.css";

const TextEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const editorRef = useRef(null);

  const styleMap = {
    HEADING: {
      color: "black",
      fontSize: "35px",
      fontWeight: "800",
    },
    BOLD: {
      color: "black",
      fontSize: "16px",
      fontWeight: "bold",
    },
    RED: {
      color: "red",
      fontSize: "16px",
      fontWeight: "400",
    },
    UNDERLINE: {
      color: "black",
      textDecoration: "underline",
      fontSize: "16px",
      fontWeight: "400",
    },
  };

  useEffect(() => {
    // Focus on the editor when the component mounts
    editorRef.current.focus();
  }, []);

  useEffect(() => {
    // Save content to local storage whenever editorState changes
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
  }, [editorState]);

  const keyBindingFn = (event) => {
    // CTRL + H  / Heading
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 72) {
      return "heading";
    }

    // CTRL + B  // Bold
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 66) {
      return "bold";
    }

    // CTRL + R  // Red
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 82) {
      return "red";
    }

    // CTRL + U  // Underline
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 76) {
      return "underline";
    }

    if (event.keyCode === 13) {
      return "enter";
    }

    return getDefaultKeyBinding(event);
  };

  const handleKeyCommand = useCallback(
    (command) => {
      let newState;

      if (command === "heading") {
        newState = RichUtils.toggleInlineStyle(editorState, "HEADING");
      }

      if (command === "bold") {
        newState = RichUtils.toggleInlineStyle(editorState, "BOLD");
      }

      if (command === "red") {
        newState = RichUtils.toggleInlineStyle(editorState, "RED");
      }

      if (command === "underline") {
        newState = RichUtils.toggleInlineStyle(editorState, "UNDERLINE");
      }

      // Check if Enter key is pressed and handle the "split-block" command
      if (command === "enter") {
        const currentStyle = editorState.getCurrentInlineStyle();
        newState = RichUtils.insertSoftNewline(editorState);

        // Clear all inline styles on the new line
        currentStyle.forEach((style) => {
          newState = RichUtils.toggleInlineStyle(newState, style);
        });
      }

      if (newState) {
        setEditorState(newState);
        return "handled";
      }
      return "not-handled";
    },
    [editorState]
  );

  const handleSaveClick = () => {
    // Save content to local storage when Save button is clicked
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
    console.log("Saved");
  };

  return (
    <div>
      <div className="header">
        <div></div>
        <Title name="Vedant Gour" />
        <Button label="Save" onClick={handleSaveClick} />
      </div>
      <div
        className="editor-box"
        onClick={() => {
          // Set focus when clicking on editor-box
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }}
      >
        <Editor
          ref={editorRef}
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={(newState) => setEditorState(newState)}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          className="editor"
        />
      </div>

      <div className="controls">
        <h3>Controls:</h3>
        <p className="heading">Heading: <span>CTRL+H</span></p>
        <p className="bold">Bold Font: <span>CTRL+B</span></p>
        <p className="red">Red Color: <span>CTRL+R</span></p>
        <p className="underline">Underline: <span>CTRL+U</span></p>
      </div>
    </div>
  );
};

export default TextEditor;
