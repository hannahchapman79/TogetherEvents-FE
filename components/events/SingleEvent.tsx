import { SiGooglecalendar } from "react-icons/si";
import { FiMapPin, FiUsers } from "react-icons/fi";
import { LuClock } from "react-icons/lu";
import { IoLink } from "react-icons/io5";
import Event from "@/types/event";
import GoogleCalendarButton from "./AddToCalendarButton";
import AttendEventButton from "./AttendEventButton";
import EditEventButton from "./admin/EditEventButton";
import DeleteEventButton from "./admin/DeleteEventButton";

interface SingleEventProps {
  event: Event;
  isAdmin?: boolean;
}

const categoryImages: Record<string, string> = {
  "Arts & Creativity": "/arts.jpg",
  "Book Club": "/books.jpg",
  Networking: "/networking.jpg",
  Entertainment: "/entertainment.jpg",
  "Health & Wellness": "/wellness.jpg",
  "Outdoors & Adventure": "/outdoors.jpg",
  Education: "education.jpg",
};

export default function SingleEvent({ event, isAdmin = false }: SingleEventProps) {

  const eventImage =
  event.image || categoryImages[event.category || ""] || "/images/default.jpg";

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC' 
    });
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
      timeZone: 'UTC' 
    });
  };

  // Calculate event duration
  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  
  // Get attendance stats
  const attendeeCount = event.attendees.length;
  const spotsRemaining = event.maxAttendees 
    ? event.maxAttendees - attendeeCount 
    : null;

  return (
    <div className="max-w-4xl mx-auto mt-16 bg-white rounded-lg shadow-md overflow-hidden">

      {eventImage ? (
        <div className="h-64 w-full overflow-hidden">
          <img 
            src={eventImage} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      )}
      
      <div className="px-6 pt-6 pb-2">
        <span className="ml-2 inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
          {event.category}
        </span>
      </div>
      
      <div className="px-6 pt-2 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        <p className="text-gray-600 mt-2 whitespace-pre-line">{event.description}</p>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-4">

            <div className="flex items-start">
              <SiGooglecalendar className="h-5 w-5 text-gray-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Date & Time</h3>
                <p className="text-gray-600">{formatDate(startDate)}</p>
                <p className="text-gray-600">
                  {formatTime(startDate)}
                  {endDate && ` - ${formatTime(endDate)}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FiMapPin className="h-5 w-5 text-gray-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Location</h3>
                <p className="text-gray-600 capitalize">{event.location.type}</p>
                {event.location.address && (
                  <p className="text-gray-600">{event.location.address}</p>
                )}
                {event.location.onlineLink && (
                  <div className="flex items-center mt-1">
                    <IoLink className="h-4 w-4 text-blue-500 mr-1" />
                    <a 
                      href={event.location.onlineLink} 
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Online
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            
            <div className="flex items-start">
              <LuClock className="h-5 w-5 text-gray-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Attendance</h3>
                <p className="text-gray-600">{attendeeCount} {attendeeCount === 1 ? 'person' : 'people'} attending</p>
                {spotsRemaining !== null && (
                  <p className="text-gray-600">
                    {spotsRemaining > 0 
                      ? `${spotsRemaining} spots remaining` 
                      : 'Event is full'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3">
        <GoogleCalendarButton event={event} />
        <AttendEventButton eventId={event._id} />

          <div className="flex gap-3 ml-auto">
            <EditEventButton eventId={event._id} />
            <DeleteEventButton eventId={event._id} />
          </div>
      </div>
    </div>
  );
}