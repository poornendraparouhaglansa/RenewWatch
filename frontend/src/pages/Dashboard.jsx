import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [subscriptions, setSubscriptions] = useState([]);

  const navigate = useNavigate();

  const fetchSubscriptions = async () => {

    try {

      const res = await API.get("/subscriptions");

      setSubscriptions(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const deleteSubscription = async (id) => {

    await API.delete(`/subscriptions/${id}`);

    fetchSubscriptions();

  };

  return (

    <div>

      <h2>My Subscriptions</h2>

      <button onClick={() => navigate("/add")}>
        Add Subscription
      </button>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Expiry</th>
            <th>Reminder Days</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {subscriptions.map((sub) => (

            <tr key={sub._id}>

              <td>{sub.name}</td>

              <td>{sub.type}</td>

              <td>
                {new Date(sub.expiryDate).toDateString()}
              </td>

              <td>{sub.reminderDays}</td>

              <td>

                <button
                  onClick={() => deleteSubscription(sub._id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default Dashboard;