import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddSubscription() {

  const [name, setName] = useState("");
  const [type, setType] = useState("domain");
  const [expiryDate, setExpiryDate] = useState("");
  const [reminderDays, setReminderDays] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    await API.post("/subscriptions", {
      name,
      type,
      expiryDate,
      reminderDays
    });

    navigate("/dashboard");

  };

  return (

    <div>

      <h2>Add Subscription</h2>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Subscription Name"
          onChange={(e) => setName(e.target.value)}
        />

        <select onChange={(e) => setType(e.target.value)}>

          <option value="domain">Domain</option>
          <option value="ssl">SSL</option>
          <option value="hosting">Hosting</option>
          <option value="other">Other</option>

        </select>

        <input
          type="date"
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Reminder Days"
          onChange={(e) => setReminderDays(e.target.value)}
        />

        <button type="submit">
          Save
        </button>

      </form>

    </div>

  );
}

export default AddSubscription;