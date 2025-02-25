let employees = []; // Global variable to store employees
let selectedEmployeeId = -1;
let selectedEmployee = {};

// Fetch Data
(async function () {
    try {
        const data = await fetch("./data.json");
        if (!data.ok) {
            throw new Error(`HTTP error! Status ${data.status}`);
        }
        employees = await data.json();
        console.log("Data fetched successfully:", employees);

        // Assign first employee as default selected (if exists)
        if (employees.length > 0) {
            selectedEmployeeId = employees[0].id;
            selectedEmployee = employees[0];
        }

        renderEmployees();
        if (selectedEmployeeId !== -1) {
            renderSingleEmployee();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
})();

// Select Employee List
const employeesList = document.querySelector(".employees_names--list");
const employeesInfo = document.querySelector(".employees_single--info");

// Add Employee
const createEmployee = document.querySelector(".createEmployee");
const addEmployeeModal = document.querySelector(".addEmployee");
const addEmployeeForm = document.querySelector(".addEmployee_create");

createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
});

addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("addEmployee")) {
        addEmployeeModal.style.display = "none";
    }
});

// Validate Date of Birth
const dobInput = document.querySelector(".addEmployee_create--dob");
dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;

addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    let empData = {};

    formData.forEach((value, key) => {
        empData[key] = value;
    });

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
    if (e.target.tagName === "I") {
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
const renderEmployees = () => {
    employeesList.innerHTML = "";
    employees.forEach((emp) => {
        const employee = document.createElement("span");
        employee.classList.add("employees_names--item");
        if (parseInt(selectedEmployeeId, 10) === emp.id) {
            employee.classList.add("selected");
            selectedEmployee = emp;
        }
        employee.setAttribute("id", emp.id);
        employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">&#10060;</i>`;
        employeesList.append(employee);
    });
};

// Render Single Employee
const renderSingleEmployee = () => {
    if (selectedEmployeeId === -1) {
        employeesInfo.innerHTML = "";
        return;
    }

    employeesInfo.innerHTML = `
        <img src="${selectedEmployee.imageUrl}" />
        <span class="employees_single--heading">
            ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
        </span>
        <span>${selectedEmployee.address}</span>
        <span>${selectedEmployee.email}</span>
        <span>Mobile - ${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>
    `;
};
