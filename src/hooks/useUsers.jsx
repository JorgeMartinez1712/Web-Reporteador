import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { sha256 } from 'js-sha256';
import { useRef } from 'react';

const useUsers = ({
  autoFetchUsers = true,
  autoFetchTypes = true,
  autoFetchStatuses = true,
} = {}) => {
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [userStatuses, setUserStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const didInitRef = useRef(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserTypes = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/user-types');
      setUserTypes(response.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error fetching user types');
      setUserTypes([]);
    }
  }, []);

  const fetchUserStatuses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/user-status');
      setUserStatuses(response.data.data || []);
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error fetching user statuses');
      setUserStatuses([]);
    }
  }, []);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    const tasks = [];
    if (autoFetchUsers) tasks.push(fetchUsers());
    if (autoFetchTypes) tasks.push(fetchUserTypes());
    if (autoFetchStatuses) tasks.push(fetchUserStatuses());
    if (tasks.length) {
      Promise.all(tasks).catch(() => {});
    }
  }, [fetchUsers, fetchUserTypes, fetchUserStatuses, autoFetchUsers, autoFetchTypes, autoFetchStatuses]);

  const createUser = async (newUserData) => {
    setLoading(true);
    setError(null);
    try {
      const baseData = {
        name: newUserData.name,
        phone_number: newUserData.phone_number,
        email: newUserData.email,
        user_type_id: newUserData.user_type_id,
        status_id: newUserData.status_id,
        password: sha256(newUserData.password),
        password_confirmation: sha256(newUserData.password_confirmation),
      };

      let dataToSend = { ...baseData };

      switch (parseInt(newUserData.user_type_id, 10)) {
        case 1:
          break;
        case 2:
          dataToSend.financier_id = Number(newUserData.financier_id || 1);
          break;
        case 3:
          dataToSend.retail_id = Number(newUserData.retail_id);
          break;
        case 4:
          dataToSend.retail_unit_id = Number(newUserData.retail_unit_id);
          break;
        case 5:
          dataToSend.document_number = newUserData.document_number;
          dataToSend.document_type_id = Number(newUserData.document_type_id);
          dataToSend.address = newUserData.address;
          dataToSend.retail_id = Number(newUserData.retail_id);
          dataToSend.retail_unit_id = Number(newUserData.retail_unit_id);
          break;
        default:
          break;
      }

      const response = await axiosInstance.post('/users/register', dataToSend);
      const resData = response.data || {};

      if (resData.succes === false || resData.success === false) {
        let msg = 'Error creating user';
        if (resData.message) {
          if (typeof resData.message === 'string') msg = resData.message;
          else if (typeof resData.message === 'object') {
            const parts = [];
            for (const key of Object.keys(resData.message)) {
              const val = resData.message[key];
              if (Array.isArray(val)) parts.push(...val);
              else parts.push(String(val));
            }
            msg = parts.join(' ');
          } else msg = String(resData.message);
        }

        setError(msg);
        throw new Error(msg);
      }

      const createdUser = resData.data || resData.user || resData || response.data;
      setUsers(prevUsers => [...prevUsers, createdUser]);
      return response;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error creating user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const dataToSend = {
        id: Number(id),
        name: updatedData.name,
        phone_number: updatedData.phone_number,
        email: updatedData.email,
        user_type_id: updatedData.user_type_id,
        status_id: updatedData.status_id,
      };

      if (updatedData.password) {
        dataToSend.password = sha256(updatedData.password);
        dataToSend.password_confirmation = sha256(updatedData.password_confirmation);
      }

      switch (parseInt(updatedData.user_type_id, 10)) {
        case 1:
          break;
        case 2:
          dataToSend.financier_id = Number(updatedData.financier_id || 1);
          break;
        case 3:
          dataToSend.retail_id = Number(updatedData.retail_id);
          break;
        case 4:
          dataToSend.retail_unit_id = Number(updatedData.retail_unit_id);
          break;
        case 5:
          dataToSend.document_number = updatedData.document_number;
          dataToSend.document_type_id = Number(updatedData.document_type_id);
          dataToSend.address = updatedData.address;
          dataToSend.retail_id = Number(updatedData.retail_id);
          dataToSend.retail_unit_id = Number(updatedData.retail_unit_id);
          break;
        default:
          break;
      }

      const response = await axiosInstance.post('/users/update', dataToSend);
      const updatedUser = response?.data?.user || response?.data?.data || response.data;
      if (!updatedUser || !updatedUser.id) {
        throw new Error("Error: Invalid user update response.");
      }

      setUsers(prevUsers =>
        prevUsers.map(user => (parseInt(user.id) === parseInt(updatedUser.id) ? updatedUser : user))
      );
      return updatedUser;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error updating user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setUserStatus = async (id, statusId) => {
    setLoading(true);
    setError(null);
    try {
      const userToUpdate = users.find(user => parseInt(user.id) === parseInt(id));
      if (!userToUpdate) {
        throw new Error("User not found for status update.");
      }

      const dataToSend = {
        name: userToUpdate.name,
        phone_number: userToUpdate.phone_number,
        email: userToUpdate.email,
        status_id: statusId,
      };

      const response = await axiosInstance.put(`/users/${id}`, dataToSend);
      const updatedUser = response.data.data || response.data;

      setUsers(prevUsers => prevUsers.map(user => (parseInt(user.id) === parseInt(updatedUser.id) ? updatedUser : user)));
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error changing user status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      const raw = response.data;
      const detailed = raw?.user || raw?.data?.user || raw?.data?.data || raw?.data || raw;
      if (detailed && detailed.id) {
        setUsers(prev => {
          const exists = prev.some(u => parseInt(u.id) === parseInt(detailed.id));
          if (exists) {
            return prev.map(u => (parseInt(u.id) === parseInt(detailed.id) ? detailed : u));
          }
          return [...prev, detailed];
        });
      }
      return detailed;
    } catch (err) {
      setError(err.friendlyMessage || err.response?.data?.message || 'Error fetching user detail');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    userTypes,
    userStatuses,
    loading,
    error,
    fetchUsers,
    fetchUserTypes,
    fetchUserStatuses,
    createUser,
    updateUser,
    setUserStatus,
    fetchUserById,
  };
};

export default useUsers;