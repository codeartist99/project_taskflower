import React from 'react';
import { CommonLayout } from '../../layout/CommonLayout';

export const TaskPage: React.FC = () => {
    return (
        <CommonLayout>
            <div className="flex flex-col h-full">
                {/* TaskHeader Component */}
                <TaskHeader/>

                {/* Boards Section */}
                <div className="flex gap-2 p-2">
                    <TaskBoard title="ToDo"/>
                    <TaskBoard title="In Progress"/>
                    <TaskBoard title="Done"/>
                </div>
            </div>
        </CommonLayout>
    );
};

// TaskBoard Component
export const TaskBoard: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="w-1/3 bg-white shadow-md rounded-md p-2 border border-gray-200 flex flex-col h-[calc(100vh-10rem)]">
            <TaskBoardHeader title={title} />
            <div className="flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 gap-2">
                {/* Task component will be placed here */}
                <Task />
            </div>
        </div>
    );
};

// TaskBoardHeader Component
const TaskBoardHeader: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">+</button>
        </div>
    );
};

// Task Component (Temporary Design)
const Task: React.FC = () => {
    return (
        <div className="bg-gray-100 p-3 rounded-md shadow-sm border border-gray-300 hover:bg-gray-200 transition">
            <p className="text-gray-800">Temporary Task</p>
        </div>
    );
};

// TaskHeader Component (Temporary Design)
const TaskHeader: React.FC = () => {
    return (
        <div className="bg-white p-4 shadow-md ">
            <h1 className="text-xl font-bold text-gray-800">Task Management</h1>
        </div>
    );
};