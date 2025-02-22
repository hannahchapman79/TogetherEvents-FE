"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const initialFormData = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  locationType: "physical",
  address: "",
  onlineLink: "",
  category: "",
  maxAttendees: "",
  status: "draft",
};

export function CreateEventForm() {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!user?.isAdmin) {
      setError("Only admins can create events");
      return;
    }

    setLoading(true);
    setError(null);

    const location = {
      type: formData.locationType,
      address:
        formData.locationType === "physical" ? formData.address : undefined,
      onlineLink:
        formData.locationType === "online" || formData.locationType === "hybrid"
          ? formData.onlineLink
          : undefined,
    };

    const eventData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : null,
      organiser: user.user_id,
      location,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      router.push("/events");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create event. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Start Date *</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Location Type *</label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="physical">Physical</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {(formData.locationType === "online" ||
          formData.locationType === "hybrid") && (
          <div>
            <label className="block mb-1">Online Link</label>
            <input
              type="url"
              name="onlineLink"
              value={formData.onlineLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block mb-1">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Max Attendees</label>
          <input
            type="number"
            name="maxAttendees"
            value={formData.maxAttendees}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
