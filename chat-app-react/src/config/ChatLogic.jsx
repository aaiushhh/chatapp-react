export const getSender = (loggedUser, users) => {
    return users[0].username === loggedUser.username ? users[1] : users[0]; // Return the other user object
};