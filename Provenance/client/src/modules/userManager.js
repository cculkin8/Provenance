import { getToken } from "./authManager";
const _apiUrl = "/api/userprofile";


export const GetAllUsers = () => {
  return getToken().then((token) => {
    return fetch(_apiUrl + '/GetAll', {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("An unknown error occurred while trying to get quotes.");
      }
    });
  });
}
export const activateUser = (id) => {
  return getToken().then((token) => {
    return fetch(`${_apiUrl}/activate/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
  });
}
export const DeleteUser = (id) => {
  return getToken().then((token) => {
    return fetch(`${_apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    }).then(resp =>{
      if(resp.status === 666)alert("Unable to remove the last Admin");
    });
  });
}
export const getUserById = (id) => {
  return getToken().then((token) => {
    return fetch(_apiUrl + `/GetUser/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("An unknown error occurred while trying to get quotes.");
      }
    });
  });
}
export const checkUnique = (user) => {
  return getToken().then((token) => {
    return fetch(_apiUrl + '/GetUnique', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    }).then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error("An unknown error occurred while trying to get quotes.");
      }
    });
  });
}

export const editUser = (user) => {
  return getToken().then((token) => {
    return fetch(_apiUrl + `/${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    }).then(resp => {
      if (resp.ok) {
        return;
      } else if (resp.status === 401) {
        throw new Error("Unauthorized");
      } else {
        throw new Error("An unknown error occurred while trying to edit a user.");
      }
    });
  });
}
