"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface EventData {
  id?: string;
  title: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  location?: {
    type: "physical" | "online" | "hybrid";
    address?: string;
    onlineLink?: string;
  };
  category: string;
  imageUrl?: string;
  maxAttendees?: number;
  status: "draft" | "published" | "cancelled" | "completed";
}

export default function EditEventForm({ eventId }: { eventId: string }) {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [originalData, setOriginalData] = useState<EventData | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    locationType: "physical",
    address: "",
    onlineLink: "",
    category: "",
    imageUrl: "",
    maxAttendees: "",
    status: "draft",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const eventData = response.data;
        setEvent(eventData);
        setOriginalData(eventData);

        const formatDateForInput = (dateString: string | number | Date) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };

        setFormData({
          title: eventData.title || "",
          description: eventData.description || "",
          startDate: formatDateForInput(eventData.startDate),
          endDate: formatDateForInput(eventData.endDate),
          locationType: eventData.location?.type || "physical",
          address: eventData.location?.address || "",
          onlineLink: eventData.location?.onlineLink || "",
          category: eventData.category || "",
          imageUrl: eventData.imageUrl || "",
          maxAttendees: eventData.maxAttendees?.toString() || "",
          status: eventData.status || "draft",
        });

        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            "Failed to edit event. Please try again.";
          setError(errorMessage);
        }
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, accessToken]);

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

  const getChangedFields = (): Partial<EventData> => {
    if (!originalData) return {};

    const changes: any = {};

    if (formData.title !== originalData.title) {
      changes.title = formData.title;
    }

    if (formData.description !== originalData.description) {
      changes.description = formData.description;
    }

    const startDate = formData.startDate
      ? new Date(formData.startDate).toISOString()
      : null;
    const origStartDate = originalData.startDate
      ? new Date(originalData.startDate).toISOString()
      : null;
    if (startDate !== origStartDate) {
      changes.startDate = formData.startDate
        ? new Date(formData.startDate).toISOString()
        : null;
    }

    const endDate = formData.endDate
      ? new Date(formData.endDate).toISOString()
      : null;
    const origEndDate = originalData.endDate
      ? new Date(originalData.endDate).toISOString()
      : null;
    if (endDate !== origEndDate) {
      changes.endDate = formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null;
    }

    if (formData.category !== originalData.category) {
      changes.category = formData.category;
    }

    if (formData.imageUrl !== (originalData.imageUrl || "")) {
      changes.imageUrl = formData.imageUrl || undefined;
    }

    const maxAttendees = formData.maxAttendees
      ? parseInt(formData.maxAttendees)
      : undefined;
    if (maxAttendees !== originalData.maxAttendees) {
      changes.maxAttendees = maxAttendees;
    }

    if (formData.status !== originalData.status) {
      changes.status = formData.status;
    }

    const originalLocationType = originalData.location?.type || "physical";
    if (formData.locationType !== originalLocationType) {
      changes.location = { type: formData.locationType };
    }

    const originalAddress = originalData.location?.address || "";
    const originalOnlineLink = originalData.location?.onlineLink || "";

    if (
      formData.address !== originalAddress ||
      formData.onlineLink !== originalOnlineLink ||
      formData.locationType !== originalLocationType
    ) {
      changes.location = changes.location || { type: formData.locationType };

      if (
        (formData.locationType === "physical" ||
          formData.locationType === "hybrid") &&
        formData.address !== originalAddress
      ) {
        changes.location.address = formData.address;
      }

      if (
        (formData.locationType === "online" ||
          formData.locationType === "hybrid") &&
        formData.onlineLink !== originalOnlineLink
      ) {
        changes.location.onlineLink = formData.onlineLink;
      }
    }

    return changes;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!user?.isAdmin) {
      setError("Only admins can update events");
      return;
    }

    setSaving(true);
    setError(null);

    const updates = getChangedFields();

    if (Object.keys(updates).length === 0) {
      setError("No changes detected");
      setSaving(false);
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-6 mt-20">Loading event details...</div>
    );
  }

  if (error && !event) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center my-6 mt-12">Edit Event</h1>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-4">
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Start Date *
          </label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            End Date
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Location Type *
          </label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="physical">Physical</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {(formData.locationType === "physical" ||
          formData.locationType === "hybrid") && (
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        )}

        {(formData.locationType === "online" ||
          formData.locationType === "hybrid") && (
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Online Link
            </label>
            <input
              type="url"
              name="onlineLink"
              value={formData.onlineLink}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        )}

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Category *
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Max Attendees
          </label>
          <input
            type="number"
            name="maxAttendees"
            value={formData.maxAttendees}
            onChange={handleChange}
            min="1"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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

        <div className="flex gap-4 justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="text-white bg-accent-3 hover:bg-accent-3-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
