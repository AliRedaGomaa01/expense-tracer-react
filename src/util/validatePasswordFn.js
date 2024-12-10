export default function validatePasswordFn(password, password_confirmation = null) {
    const validationErrors = [];
    if (password.length < 8) {
        validationErrors.push("The password field must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
        validationErrors.push("The password field must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        validationErrors.push("The password field must contain at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
        validationErrors.push("The password field must contain at least one number.");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        validationErrors.push("The password field must contain at least one symbol.");
    }
    if (!!password && !!password_confirmation && password !== password_confirmation) {
        validationErrors.push("The password field confirmation does not match.");
    }
    return validationErrors;
}