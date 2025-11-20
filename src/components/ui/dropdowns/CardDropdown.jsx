import React from 'react';
import BaseDropdown from '@ui/dropdowns/BaseDropdown.jsx';
import '@scss/ui/dropdowns/_cardDropdown.scss';
import EditIcon from '~icons/ph/pencil-bold';
import DeleteIcon from '~icons/ph/trash-bold';
import idb from "@util/indexed_db.js";

const CardDropdown = ({ mindmapId, isOpen, closeDropdown }) => {

    //TODO: fix refresh
    const handleDelete = async (e) => {
        e.stopPropagation(); 
        await idb.DeleteMindmap(mindmapId);
        closeDropdown();
    };


    const handleEdit = () => {
        alert(`Editing mindmap with ID: ${mindmapId}`);
        closeDropdown();
    };

    // Dropdown Content
    const dropdownContent = (
        <>
            <button className="edit_button" onClick={handleEdit}>
                <EditIcon />
                Edit
            </button>
            <button className="delete_button" onClick={handleDelete}>
                <DeleteIcon />
                Delete
            </button>
        </>
        
    );

    return (
        <div className={`card_dropdown ${isOpen ? "open" : ""}`}>
            <BaseDropdown
                isOpen={isOpen}
                content={dropdownContent}
                closeDropdown={closeDropdown}
                unfurlDirection={"left"}
            />
        </div>
    );
};

export default CardDropdown;