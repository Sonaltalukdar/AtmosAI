import { CloudSun, Wind, Droplets, CalendarDays } from "lucide-react";
import AIChat from "../components/AIChat";

const SUGGESTED_QUESTIONS = [
    { icon: CloudSun, label: "Today's weather?", text: "What's the weather like today?" },
    { icon: Wind, label: "Today's AQI?", text: "What's today's AQI?" },
    { icon: Droplets, label: "Will it rain tomorrow?", text: "Will it rain tomorrow?" },
    { icon: CalendarDays, label: "This week's forecast", text: "Give me this week's weather forecast." },
];

function AIAssistant({ currentUser }) {
    return (
        <div
            className="relative w-full flex flex-col overflow-hidden"
            style={{ height: "calc(100vh - var(--navbar-height))" }}
        >
            <AIChat suggestions={SUGGESTED_QUESTIONS} currentUser={currentUser} />
        </div>
    );
}

export default AIAssistant;