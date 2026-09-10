//--__--__--INITIALIZING THINGS--__--__--

const history = new HistoryManager();

let currentMenu = null;

function showMenu(menuData, position) {
  const existingMenu = document.querySelector(".menu");

  if (existingMenu) {
    existingMenu.remove();
  }

  currentMenu = menuData;
  const menu = document.createElement("div");
  menu.className = "menu";

  menu.style.top = `${position.y + 20}px`;
  menu.style.left = `${position.x + 10}px`;

  menuData.buttons.forEach(({ name, shortcut, action }) => {
    const button = document.createElement("button");

    button.textContent = name;

    const shortcutText = document.createElement("span");
    shortcutText.textContent = shortcut;

    button.appendChild(shortcutText);

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      action();
      menu.remove();
    });

    menu.appendChild(button);
  });

  document.body.appendChild(menu);

  setTimeout(() => {
    document.addEventListener("click", closeMenu, { once: true });
  });

  function closeMenu(event) {
    if (!menu.contains(event.target)) {
      menu.remove();
    }
  }
}

function handleKeyDown(e) {
  const mod = e.ctrlKey || e.metaKey;

  if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
    e.preventDefault();
    history.undo();
    return;
  }

  if (
    mod &&
    ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y")
  ) {
    e.preventDefault();
    history.redo();
    return;
  }
}

window.addEventListener("keydown", handleKeyDown);
