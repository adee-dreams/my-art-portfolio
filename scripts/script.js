console.log("Script loaded!");

const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = 'Toggle Dark Mode';
document.body.prepend(darkModeToggle);

console.log("Button created:", darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    console.log("Button clicked!");
    document.body.classList.toggle('dark-mode');
});