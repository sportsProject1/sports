import React, { useState, useEffect } from "react";
import { fetchTokenData, putTokenJsonData } from "../../../../Server/ApiService";

function UserRoleManager({ userId }) {
    const [role, setRole] = useState("");
    const [availableRoles] = useState(["ROLE_USER", "ROLE_MANAGER", "ROLE_SELLER", "ROLE_ADMIN"]);

    useEffect(() => {
        // 사용자 권한 가져오기
        const getUserRole = async () => {
            try {
                const response = await fetchTokenData(`/admin/users/${userId}/role`);
                setRole(response.data); // 응답 데이터에서 권한 설정
            } catch (error) {
                console.error("Failed to fetch user role:", error);
            }
        };

        getUserRole();
    }, [userId]);

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const saveRole = async () => {
        try {
            await putTokenJsonData(`/admin/users/${userId}/role`, { role });
            alert("Role updated successfully!");
        } catch (error) {
            console.error("Failed to update role:", error);
            alert("Failed to update role.");
        }
    };

    return (
        <div>
            <h3>User Role Management</h3>
            <select value={role} onChange={handleRoleChange}>
                {availableRoles.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>
            <button onClick={saveRole}>Save Role</button>
        </div>
    );
}

export default UserRoleManager;