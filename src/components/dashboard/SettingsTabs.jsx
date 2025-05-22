"use client";

import { useState, Children } from "react";

export default function SettingsTabs({ children }) {
  const [activeTab, setActiveTab] = useState("profile");

  // Extract tabs and content from children
  const tabs = [];
  const contents = {};

  // This is a simplified approach - in a real app, you might use Children.map
  // to properly handle and transform the children
  Children.forEach(children, (child) => {
    if (child.props && child.props.id) {
      const id = child.props.id;
      tabs.push({
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1) // Capitalize first letter
      });
      contents[id] = child;
    }
  });

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Display only the active tab content */}
      {Object.keys(contents).map((id) => (
        <div key={id} className={activeTab === id ? "block" : "hidden"}>
          {contents[id]}
        </div>
      ))}
    </div>
  );
}