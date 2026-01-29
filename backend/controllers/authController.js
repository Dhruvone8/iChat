const handleRegistration = async (req, res) => {
    const { fullName, email, password } = req.body

    try {

        // Check if all the fields are filled
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check password length validation
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        // Check Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email format" })
        }

    } catch (error) {

    }
}