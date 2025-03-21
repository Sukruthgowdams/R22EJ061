import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api";

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      console.log("Top Users Data:", data);
      setUsers(data);
      setLoading(false);
    };
    getUsers();
  }, []);

  return (
    <div className="container">
      <h2>🔥 Top 5 Users</h2>
      {loading ? (
        <p>Loading users... 🔄</p>
      ) : (
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                <strong>{user.name}</strong> - 📝 {user.postCount} Posts
              </li>
            ))
          ) : (
            <p>No users found ❌</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default TopUsers;
