import React, { useEffect, useRef, useState } from 'react';
import './AnimatedInput.css';

const AnimatedInput = ({ user, value: display, type, getChangedValue }) => {
  const [value, setValue] = useState('');
  const [action, setAction] = useState('edit');
  const penRef = useRef();
  const checkRef = useRef();
  const borderRef = useRef();
  const inputRef = useRef();
  const prevAction = useRef('edit');

  useEffect(() => {
    setValue(user[display]);
  }, [user, display]);

  useEffect(() => {
    if (prevAction.current === 'save' && action === 'edit') {
      if (typeof getChangedValue === 'function')
        getChangedValue({ [display]: value.trim() });
    }
    prevAction.current = action;
  }, [value, getChangedValue, display, action]);

  function handleEdit(e) {
    if (action === 'save') {
      if (value === null) return;
      if (!value.trim()) return;
    }
    if (action === 'save') {
    }
    if (action === 'edit') {
      inputRef.current.disabled = false;
      inputRef.current.focus();
      penRef.current.classList.add('hide');
      penRef.current.classList.remove('hide-reverse');
      checkRef.current.classList.add('hide');
      checkRef.current.classList.remove('hide-reverse');
      borderRef.current.classList.add('active');
      borderRef.current.classList.remove('active-reverse');
      setAction('save');
    } else {
      inputRef.current.disabled = true;
      penRef.current.classList.remove('hide');
      penRef.current.classList.add('hide-reverse');
      checkRef.current.classList.remove('hide');
      checkRef.current.classList.add('hide-reverse');
      borderRef.current.classList.remove('active');
      borderRef.current.classList.add('active-reverse');
      setAction('edit');
    }
  }

  const handleChange = (name) => (event) => {
    setValue(event.target.value);
  };
  function handleSubmit(event) {
    event.preventDefault();
    if (event.type === 'submit') handleEdit(event);
  }
  return (
    <div className="animatedInput">
      <form onSubmit={handleSubmit}>
        <input
          className={`animatedInput `}
          disabled
          ref={inputRef}
          type={type}
          value={value ? value : ''}
          onChange={handleChange(display)}
        />
      </form>
      <div ref={borderRef} className="border"></div>
      <i ref={penRef} onClick={handleEdit} className="fas fa-pen"></i>
      <i ref={checkRef} onClick={handleEdit} className="fas fa-check"></i>
    </div>
  );
};

export default AnimatedInput;
