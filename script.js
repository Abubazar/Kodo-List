//Initializing things
const history = new HistoryManager();
let mousePosition = { x: 0, y: 0 };

let currentMenu = null;

//Global listener
window.addEventListener("mousemove", (event) => {
  const pos = { x: event.clientX, y: event.clientY };
  mousePosition = pos;
  mouseDrag();
});

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

  // Close when clicking outside the menu
  setTimeout(() => {
    document.addEventListener("click", closeMenu, { once: true });
  });

  function closeMenu(event) {
    if (!menu.contains(event.target)) {
      menu.remove();
    }
  }
}

const fileMenuData = {
  buttons: [
    {
      name: "Create new desk",
      shortcut: "Ctrl+N",
      action: () => {
        console.log("create file");
      },
    },
    {
      name: "Open existing desk",
      shortcut: "Ctrl+O",
      action: () => {
        console.log("open file");
      },
    },
    {
      name: "Save desk",
      shortcut: "Ctrl+S",
      action: () => {
        console.log("save file");
      },
    },
    {
      name: "Save desk as",
      shortcut: "Ctrl+Shift+S",
      action: () => {
        console.log("save file as sumn");
      },
    },
  ],
};

function toolbarMenu(menu) {
  const fileMenu = showMenu(menu, mousePosition);
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
