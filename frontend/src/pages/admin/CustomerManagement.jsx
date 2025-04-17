import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [note, setNote] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !note.trim()) return;

    try {
      await axios.post(`/api/customers/${selectedCustomer._id}/notes`, { note });
      toast.success('Note added successfully');
      setNote('');
      fetchCustomers();
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !newTag.trim()) return;

    try {
      await axios.post(`/api/customers/${selectedCustomer._id}/tags`, { tag: newTag });
      toast.success('Tag added successfully');
      setNewTag('');
      fetchCustomers();
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const handleRemoveTag = async (customerId, tagToRemove) => {
    try {
      await axios.delete(`/api/customers/${customerId}/tags/${tagToRemove}`);
      toast.success('Tag removed successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
    }
  };

  const handleUpdateLastContact = async (customerId) => {
    try {
      await axios.put(`/api/customers/${customerId}/last-contact`);
      toast.success('Last contact date updated successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Error updating last contact:', error);
      toast.error('Failed to update last contact date');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Customer Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all customers including their contact information and history.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tags
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Contact
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div>{customer.email}</div>
                        <div>{customer.phone}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-2">
                          {customer.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {customer.lastContact
                          ? new Date(customer.lastContact).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleUpdateLastContact(customer._id)}
                          className="ml-2 text-primary-600 hover:text-primary-900"
                        >
                          Update Contact
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-medium text-gray-900">Customer Details</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-900">{selectedCustomer.email}</p>
                <p className="text-sm text-gray-900">{selectedCustomer.phone}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedCustomer.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(selectedCustomer._id, tag)}
                        className="ml-1 text-primary-600 hover:text-primary-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <form onSubmit={handleAddTag} className="mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add new tag"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>

              {selectedCustomer.notes && selectedCustomer.notes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <ul className="mt-1 space-y-2">
                    {selectedCustomer.notes.map((note, index) => (
                      <li key={index} className="text-sm text-gray-900">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleAddNote} className="mt-4">
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                    Add Note
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Add Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 