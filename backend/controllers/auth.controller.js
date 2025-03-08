
export const signup =  (req, res) => {
  res.json({
    message: "You hit the signup endpoint",
  });
};

export const login = (req, res) => {
    res.json({
      message: "You hit the login endpoint",
    });
  };

  export const logout = (req, res) => {
    res.json({
      message: "You hit the logout endpoint",
    });
  };