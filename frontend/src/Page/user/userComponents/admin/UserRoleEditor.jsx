import React, { useState } from "react";
import styled from "styled-components";
import { putTokenJsonData } from "../../../../Server/ApiService";

// Styled Components
const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
`;

const Select = styled.select`
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
`;

const Button = styled.button`
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background-color: #218838;
    }

    &:last-child {
        background-color: #dc3545;

        &:hover {
            background-color: #c82333;
        }
    }
`;

function UserRoleEditor({ user, onClose }) {
    const [role, setRole] = useState(user.role);
    const availableRoles = ["ROLE_USER", "ROLE_MANAGER", "ROLE_SELLER", "ROLE_ADMIN"];

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const saveRole = async () => {
        try {
            await putTokenJsonData(`/admin/users/${user.id}/role`, { role });
            alert("Role updated successfully!");
            onClose();
        } catch (error) {
            console.error("Failed to update role:", error);
            alert("Failed to update role.");
        }
    };

    return (
        <Modal>
            <ModalContent>
                <h3>Edit Role for {user.username}</h3>
                <Select value={role} onChange={handleRoleChange}>
                    {availableRoles.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </Select>
                <Button onClick={saveRole}>Save</Button>
                <Button onClick={onClose}>Cancel</Button>
            </ModalContent>
        </Modal>
    );
}

export default UserRoleEditor;
