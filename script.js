let employees = []; // Global variable to store employees
let selectedEmployeeId = -1;
let selectedEmployee = {};

// Fetch Data
(async function () {
    try {
        const response = await fetch("./data.json");
        if (!response.ok) throw new Error(`HTTP error! Status ${response.status}`);
        employees = await response.json();
        console.log("Data fetched successfully:", employees);

        if (employees.length > 0) {
            selectedEmployeeId = employees[0].id;
            selectedEmployee = employees[0];
        }

        renderEmployees();
        if (selectedEmployeeId !== -1) renderSingleEmployee();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
})();

// DOM Elements
const employeesList = document.querySelector(".employees_names--list");
const employeesInfo = document.querySelector(".employees_single--info");
const searchInput = document.querySelector(".searchEmployee");
const sortEmployees = document.querySelector(".sortEmployees");
const themeToggle = document.querySelector(".themeToggle");
const createEmployee = document.querySelector(".createEmployee");
const addEmployeeModal = document.querySelector(".addEmployee");
const addEmployeeForm = document.querySelector(".addEmployee_create");
const dobInput = document.querySelector(".addEmployee_create--dob");

// Search Employees
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEmployees = employees.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm)
    );
    renderEmployees(filteredEmployees);
});

// Sort Employees
sortEmployees.addEventListener("change", () => {
    const sortValue = sortEmployees.value;
    let sortedEmployees = [...employees];
    
    sortedEmployees.sort((a, b) => {
        if (sortValue === "name") {
            return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
        } else if (sortValue === "age") {
            return a.age - b.age;
        }
        return 0;
    });
    renderEmployees(sortedEmployees);
});

// Dark Mode Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Add Employee
createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
});

addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("addEmployee")) {
        addEmployeeModal.style.display = "none";
    }
});
dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;

addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    let empData = Object.fromEntries(formData.entries());
    
    empData.id = employees.length ? employees[employees.length - 1].id + 1 : 1;
    empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl = empData.imageUrl || "gfg.png";

    employees.push(empData);
    renderEmployees();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
});

// Select and Delete Employee
employeesList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== Number(e.target.id)) {
        selectedEmployeeId = Number(e.target.id);
        selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId) || {};
        renderEmployees();
        renderSingleEmployee();
    }

    // Delete Employee
    if (e.target.classList.contains("employeeDelete")) {
        employees = employees.filter(emp => String(emp.id) !== e.target.parentNode.id);
        if (String(selectedEmployeeId) === e.target.parentNode.id) {
            selectedEmployeeId = employees[0]?.id || -1;
            selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId) || {};
            renderSingleEmployee();
        }
        renderEmployees();
    }
});

// Render All Employees
const renderEmployees = (filteredEmployees = employees) => {
    employeesList.innerHTML = "";
    filteredEmployees.forEach((emp) => {
        const employee = document.createElement("span");
        employee.classList.add("employees_names--item", "fade-in");
        if (parseInt(selectedEmployeeId, 10) === emp.id) {
            employee.classList.add("selected");
            selectedEmployee = emp;
        }
        employee.setAttribute("id", emp.id);
        employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">&#10060;</i>`;
        employeesList.append(employee);
        setTimeout(() => employee.classList.remove("fade-in"), 500);
    });
};

// Render Single Employee
const renderSingleEmployee = () => {
    employeesInfo.innerHTML = selectedEmployeeId === -1 ? "" : `
        <div class="card fade-in">
            <img src="${selectedEmployee.imageUrl}" alt="photo.jpeg" />
            <div class="employee-details">
                <span class="employees_single--heading">
                    ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
                </span>
                <span>${selectedEmployee.address}</span>
                <span>${selectedEmployee.email}</span>
                <span>Mobile - ${selectedEmployee.contactNumber}</span>
                <span>DOB - ${selectedEmployee.dob}</span>
            </div>
        </div>`;
    setTimeout(() => document.querySelector(".card")?.classList.remove("fade-in"), 500);
};
