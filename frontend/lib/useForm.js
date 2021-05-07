import { useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }

    setInputs({
      // copy the existing state
      ...inputs,
      // update change using variable as property name
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    // Turn state into array of key value pairs, clear values, recreate object from new key value pairs
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want the custom hook to surface
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
