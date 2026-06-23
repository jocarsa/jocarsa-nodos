const STORAGE_KEY = "jocarsa_nodos_projects_v6";

const defaultProjects = {
  ejemplo: {
    id: "ejemplo",
    name: "Ejemplo comparación",
    view: { x: 60, y: 80, scale: 1 },
    nodes: [
      { id: "n1", kind: "declare", title: "Declarar edad", data: { name: "edad", value: "48" }, x: 80, y: 90 },
      { id: "n2", kind: "declare", title: "Declarar suma", data: { name: "suma", value: "5" }, x: 80, y: 300 },
      { id: "n3", kind: "operation", title: "Sumar", data: { target: "resultado", left: "a", operator: "+", right: "b" }, x: 410, y: 190 },
      { id: "n4", kind: "comparison", title: "Mayor que 50", data: { left: "a", operator: ">", right: "50" }, x: 720, y: 210 },
      { id: "n5", kind: "print", title: "Mostrar resultado", data: { value: "mensaje" }, x: 1040, y: 180 }
    ],
    connections: [
      { id: "c1", from: "n1", fromSlot: "out", to: "n3", toSlot: "left" },
      { id: "c2", from: "n2", fromSlot: "out", to: "n3", toSlot: "right" },
      { id: "c3", from: "n3", fromSlot: "out", to: "n4", toSlot: "left" },
      { id: "c4", from: "n4", fromSlot: "true", to: "n5", toSlot: "in" }
    ]
  },
  suma: {
    id: "suma",
    name: "Suma",
    view: { x: 60, y: 80, scale: 1 },
    nodes: [
      { id: "n6", kind: "declare", title: "Declarar edad", data: { name: "edad", value: "48" }, x: 80, y: 90 },
      { id: "n7", kind: "declare", title: "Declarar suma", data: { name: "suma", value: "5" }, x: 80, y: 300 },
      { id: "n8", kind: "operation", title: "Operación", data: { target: "resultado", left: "a", operator: "+", right: "b" }, x: 410, y: 190 },
      { id: "n9", kind: "print", title: "Mostrar", data: { value: "resultado" }, x: 720, y: 210 }
    ],
    connections: [
      { id: "c5", from: "n6", fromSlot: "out", to: "n8", toSlot: "left" },
      { id: "c6", from: "n7", fromSlot: "out", to: "n8", toSlot: "right" },
      { id: "c7", from: "n8", fromSlot: "out", to: "n9", toSlot: "in" }
    ]
  }
};

const nodeTypes = {
  declare: {
    label: "Declarar variable",
    className: "color-accent",
    inputs: [],
    outputs: [{ id: "out", label: "OUT", offset: 52 }]
  },
  assign: {
    label: "Asignar valor",
    className: "color-blue",
    inputs: [{ id: "in", label: "IN", offset: 52 }],
    outputs: [{ id: "out", label: "OUT", offset: 52 }]
  },
  operation: {
    label: "Operación",
    className: "color-green",
    inputs: [
      { id: "left", label: "A", offset: 42 },
      { id: "right", label: "B", offset: 66 }
    ],
    outputs: [{ id: "out", label: "OUT", offset: 52 }]
  },
  comparison: {
    label: "Comparación",
    className: "color-purple",
    inputs: [
      { id: "left", label: "A", offset: 42 },
      { id: "right", label: "B", offset: 66 }
    ],
    outputs: [
      { id: "true", label: "TRUE", offset: 42 },
      { id: "false", label: "FALSE", offset: 68 }
    ]
  },
  if: {
    label: "Condición IF",
    className: "color-warning",
    inputs: [{ id: "condition", label: "COND", offset: 52 }],
    outputs: [
      { id: "true", label: "TRUE", offset: 42 },
      { id: "false", label: "FALSE", offset: 68 }
    ]
  },
  while: {
    label: "Bucle WHILE",
    className: "color-danger",
    inputs: [{ id: "condition", label: "COND", offset: 52 }],
    outputs: [
      { id: "body", label: "BODY", offset: 42 },
      { id: "exit", label: "EXIT", offset: 68 }
    ]
  },
  for: {
    label: "Bucle FOR",
    className: "color-accent",
    inputs: [{ id: "in", label: "IN", offset: 52 }],
    outputs: [
      { id: "body", label: "BODY", offset: 42 },
      { id: "exit", label: "EXIT", offset: 68 }
    ]
  },
  print: {
    label: "Mostrar",
    className: "color-green",
    inputs: [{ id: "in", label: "IN", offset: 52 }],
    outputs: [{ id: "out", label: "OUT", offset: 52 }]
  }
};

let state = {
  projects: {},
  currentProjectId: "ejemplo",
  selectedNodeId: null,
  selectedConnectionId: null,
  nodeCounter: 30,
  connectionCounter: 30,
  connecting: null,
  panning: null,
  draggingNode: null,
  lastLanguage: "pseudo"
};

const projectsList = document.getElementById("projectsList");
const workspace = document.getElementById("workspace");
const world = document.getElementById("world");
const nodesLayer = document.getElementById("nodesLayer");
const connectionsSvg = document.getElementById("connections");
const tempSvg = document.getElementById("tempConnection");
const hint = document.getElementById("workspaceHint");
const zoomIndicator = document.getElementById("zoomIndicator");
const consoleOutput = document.getElementById("consoleOutput");

const nodeTitle = document.getElementById("nodeTitle");
const nodeKind = document.getElementById("nodeKind");
const nodeId = document.getElementById("nodeId");
const nodeData = document.getElementById("nodeData");

function currentProject() {
  return state.projects[state.currentProjectId];
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    state.projects = structuredClone(defaultProjects);
    saveState();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.projects = parsed.projects || structuredClone(defaultProjects);
    state.currentProjectId = parsed.currentProjectId || Object.keys(state.projects)[0] || "ejemplo";
    state.nodeCounter = parsed.nodeCounter || 30;
    state.connectionCounter = parsed.connectionCounter || 30;
    migrateConnections();
  } catch {
    state.projects = structuredClone(defaultProjects);
  }
}

function migrateConnections() {
  Object.values(state.projects).forEach(project => {
    project.connections ||= [];
    project.nodes ||= [];
    project.nodes.forEach(node => {
      node.data ||= {};
      if (node.kind === "comparison" && node.data.target) delete node.data.target;
    });
    project.connections.forEach(conn => {
      conn.fromSlot ||= "out";
      conn.toSlot ||= "in";
    });
  });
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    projects: state.projects,
    currentProjectId: state.currentProjectId,
    nodeCounter: state.nodeCounter,
    connectionCounter: state.connectionCounter
  }));
}

function renderAll() {
  renderProjects();
  renderWorkspace();
  renderInspector();
  updateWorldTransform();
}

function renderProjects() {
  projectsList.innerHTML = "";

  Object.values(state.projects).forEach(project => {
    const link = document.createElement("a");
    link.href = "#";
    link.className = `project-item ${project.id === state.currentProjectId ? "activo" : ""}`;
    link.dataset.project = project.id;
    link.innerHTML = `
      <span class="folder-line">
        <span>${escapeHtml(project.name)}</span>
        <span class="folder-count">${project.nodes.length}</span>
      </span>
    `;

    link.addEventListener("click", event => {
      event.preventDefault();
      state.currentProjectId = project.id;
      state.selectedNodeId = null;
      state.selectedConnectionId = null;
      saveState();
      renderAll();
    });

    projectsList.appendChild(link);
  });
}

function renderWorkspace() {
  const project = currentProject();
  nodesLayer.innerHTML = "";
  connectionsSvg.innerHTML = "";
  tempSvg.innerHTML = "";
  hint.classList.toggle("hidden", project.nodes.length > 0);

  project.connections.forEach(connection => drawConnection(connection));
  project.nodes.forEach(node => drawNode(node));
  updateProjectCounts();
}

function drawNode(node) {
  const type = nodeTypes[node.kind] || nodeTypes.declare;
  const hasTwoInputs = type.inputs.length > 1;
  const hasTwoOutputs = type.outputs.length > 1;

  const el = document.createElement("article");
  el.className = `node-card ${hasTwoInputs ? "has-two-inputs" : ""} ${hasTwoOutputs ? "has-two-outputs" : ""} ${type.className} ${node.id === state.selectedNodeId ? "selected" : ""}`;
  el.dataset.id = node.id;
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;

  const inputSlots = type.inputs.map((slot, index) => `
    <div class="slot input slot-${index}" data-slot="input" data-slot-id="${slot.id}" data-label="${slot.label}" data-node="${node.id}" title="Entrada ${slot.label}" style="top:${slot.offset}px"></div>
  `).join("");

  const outputSlots = type.outputs.map((slot, index) => `
    <div class="slot output slot-${index + 1}" data-slot="output" data-slot-id="${slot.id}" data-label="${slot.label}" data-node="${node.id}" title="Salida ${slot.label}" style="top:${slot.offset}px"></div>
  `).join("");

  el.innerHTML = `
    ${inputSlots}
    ${outputSlots}
    <div class="node-title">${escapeHtml(node.title)}</div>
    <div class="node-body">
      <div class="agnostic-row"><span class="agnostic-key">tipo</span><span class="agnostic-value">${escapeHtml(node.kind)}</span></div>
      <code>${escapeHtml(JSON.stringify(node.data))}</code>
    </div>
    <div class="node-footer">
      <span>nodo</span>
      <span>${escapeHtml(node.id)}</span>
    </div>
  `;

  el.addEventListener("pointerdown", startNodeDrag);
  el.addEventListener("click", event => {
    event.stopPropagation();
    selectNode(node.id);
  });

  el.querySelectorAll(".slot.output").forEach(slot => {
    slot.addEventListener("pointerdown", startConnection);
  });

  el.querySelectorAll(".slot.input").forEach(slot => {
    slot.addEventListener("pointerenter", () => slot.classList.add("accepting"));
    slot.addEventListener("pointerleave", () => slot.classList.remove("accepting"));
  });

  nodesLayer.appendChild(el);
}

function drawConnection(connection) {
  const project = currentProject();
  const from = project.nodes.find(node => node.id === connection.from);
  const to = project.nodes.find(node => node.id === connection.to);
  if (!from || !to) return;

  const { x: x1, y: y1 } = outputPoint(from, connection.fromSlot);
  const { x: x2, y: y2 } = inputPoint(to, connection.toSlot);
  const path = createPath(x1, y1, x2, y2);

  path.classList.add("connection-path");
  if (connection.fromSlot === "true") path.classList.add("true-path");
  if (connection.fromSlot === "false") path.classList.add("false-path");
  if (connection.id === state.selectedConnectionId) path.classList.add("selected");

  path.dataset.id = connection.id;
  path.addEventListener("click", event => {
    event.stopPropagation();
    state.selectedNodeId = null;
    state.selectedConnectionId = connection.id;
    renderWorkspace();
    renderInspector();
  });

  connectionsSvg.appendChild(path);
}

function createPath(x1, y1, x2, y2) {
  const mid = Math.max(80, Math.abs(x2 - x1) / 2);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`);
  return path;
}

function outputPoint(node, slotId = "out") {
  const type = nodeTypes[node.kind] || nodeTypes.declare;
  const slot = type.outputs.find(item => item.id === slotId) || type.outputs[0] || { offset: 52 };
  return { x: node.x + 230, y: node.y + slot.offset };
}

function inputPoint(node, slotId = "in") {
  const type = nodeTypes[node.kind] || nodeTypes.declare;
  const slot = type.inputs.find(item => item.id === slotId) || type.inputs[0] || { offset: 52 };
  return { x: node.x, y: node.y + slot.offset };
}

function selectNode(id) {
  state.selectedNodeId = id;
  state.selectedConnectionId = null;
  renderWorkspace();
  renderInspector();
}

function renderInspector() {
  const project = currentProject();
  const selected = project.nodes.find(node => node.id === state.selectedNodeId);

  nodeTitle.value = selected ? selected.title : "";
  nodeKind.value = selected ? selected.kind : "";
  nodeId.value = selected ? selected.id : "";
  nodeData.value = selected ? JSON.stringify(selected.data, null, 2) : "";

  [nodeTitle, nodeData].forEach(input => input.disabled = !selected);
}

function updateSelectedNode() {
  const project = currentProject();
  const selected = project.nodes.find(node => node.id === state.selectedNodeId);
  if (!selected) return;

  selected.title = nodeTitle.value;

  try {
    selected.data = JSON.parse(nodeData.value || "{}");
    nodeData.style.borderColor = "";
  } catch {
    nodeData.style.borderColor = "#ef4444";
    return;
  }

  saveState();
  renderWorkspace();
}

nodeTitle.addEventListener("input", updateSelectedNode);
nodeData.addEventListener("input", updateSelectedNode);

document.querySelectorAll(".palette-node").forEach(item => {
  item.addEventListener("dragstart", event => {
    item.classList.add("dragging");
    event.dataTransfer.setData("application/json", JSON.stringify({
      kind: item.dataset.kind,
      title: item.dataset.title,
      data: JSON.parse(item.dataset.json)
    }));
  });

  item.addEventListener("dragend", () => item.classList.remove("dragging"));

  item.addEventListener("dblclick", () => {
    addNode({
      kind: item.dataset.kind,
      title: item.dataset.title,
      data: JSON.parse(item.dataset.json),
      x: 160,
      y: 160
    });
  });
});

workspace.addEventListener("dragover", event => {
  event.preventDefault();
  workspace.classList.add("drag-over");
});

workspace.addEventListener("dragleave", () => workspace.classList.remove("drag-over"));

workspace.addEventListener("drop", event => {
  event.preventDefault();
  workspace.classList.remove("drag-over");
  const raw = event.dataTransfer.getData("application/json");
  if (!raw) return;

  const data = JSON.parse(raw);
  const p = screenToWorld(event.clientX, event.clientY);

  addNode({
    ...data,
    x: Math.max(0, p.x - 115),
    y: Math.max(0, p.y - 52)
  });
});

function addNode(data) {
  const node = {
    id: "n" + state.nodeCounter++,
    kind: data.kind,
    title: data.title,
    data: data.data,
    x: data.x,
    y: data.y
  };

  currentProject().nodes.push(node);
  saveState();
  selectNode(node.id);
  createToast("Nodo añadido", `${node.title} se ha insertado.`);
}

function startNodeDrag(event) {
  if (event.target.classList.contains("slot")) return;

  const card = event.currentTarget;
  const node = currentProject().nodes.find(item => item.id === card.dataset.id);
  if (!node) return;

  event.stopPropagation();
  selectNode(node.id);

  state.draggingNode = {
    node,
    start: screenToWorld(event.clientX, event.clientY),
    originalX: node.x,
    originalY: node.y
  };

  card.setPointerCapture(event.pointerId);
}

window.addEventListener("pointermove", event => {
  if (state.draggingNode) {
    const current = screenToWorld(event.clientX, event.clientY);
    const drag = state.draggingNode;
    drag.node.x = Math.max(0, drag.originalX + current.x - drag.start.x);
    drag.node.y = Math.max(0, drag.originalY + current.y - drag.start.y);
    renderWorkspace();
    return;
  }

  if (state.connecting) {
    updateTempConnection(event.clientX, event.clientY);
    return;
  }

  if (state.panning) {
    const project = currentProject();
    project.view.x = state.panning.originalX + event.clientX - state.panning.startX;
    project.view.y = state.panning.originalY + event.clientY - state.panning.startY;
    updateWorldTransform();
  }
});

window.addEventListener("pointerup", event => {
  if (state.connecting) {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const input = target?.closest?.(".slot.input");

    if (input) {
      createConnection(state.connecting.from, state.connecting.fromSlot, input.dataset.node, input.dataset.slotId);
    }

    clearTempConnection();
    workspace.classList.remove("connecting-mode");
    state.connecting = null;
  }

  if (state.draggingNode) {
    state.draggingNode = null;
    saveState();
  }

  if (state.panning) {
    workspace.classList.remove("panning");
    state.panning = null;
    saveState();
  }
});

workspace.addEventListener("pointerdown", event => {
  if (event.target !== workspace && event.target !== world && event.target !== nodesLayer) return;

  state.selectedNodeId = null;
  state.selectedConnectionId = null;
  renderWorkspace();
  renderInspector();

  const project = currentProject();
  state.panning = {
    startX: event.clientX,
    startY: event.clientY,
    originalX: project.view.x,
    originalY: project.view.y
  };
  workspace.classList.add("panning");
});

workspace.addEventListener("wheel", event => {
  event.preventDefault();

  const project = currentProject();
  const before = screenToWorld(event.clientX, event.clientY);
  const delta = event.deltaY > 0 ? 0.9 : 1.1;
  project.view.scale = clamp(project.view.scale * delta, 0.35, 2.2);
  const after = screenToWorld(event.clientX, event.clientY);

  project.view.x += (after.x - before.x) * project.view.scale;
  project.view.y += (after.y - before.y) * project.view.scale;

  updateWorldTransform();
  saveState();
}, { passive: false });

function updateWorldTransform() {
  const project = currentProject();
  world.style.transform = `translate(${project.view.x}px, ${project.view.y}px) scale(${project.view.scale})`;
  zoomIndicator.textContent = `${Math.round(project.view.scale * 100)}%`;
}

function screenToWorld(clientX, clientY) {
  const rect = workspace.getBoundingClientRect();
  const view = currentProject().view;
  return {
    x: (clientX - rect.left - view.x) / view.scale,
    y: (clientY - rect.top - view.y) / view.scale
  };
}

function startConnection(event) {
  event.preventDefault();
  event.stopPropagation();

  const nodeId = event.currentTarget.dataset.node;
  const fromSlot = event.currentTarget.dataset.slotId;
  const node = currentProject().nodes.find(item => item.id === nodeId);
  if (!node) return;

  state.connecting = { from: nodeId, fromSlot, start: outputPoint(node, fromSlot) };
  workspace.classList.add("connecting-mode");
  updateTempConnection(event.clientX, event.clientY);
}

function updateTempConnection(clientX, clientY) {
  if (!state.connecting) return;
  tempSvg.innerHTML = "";
  const end = screenToWorld(clientX, clientY);
  const path = createPath(state.connecting.start.x, state.connecting.start.y, end.x, end.y);
  path.classList.add("temp-path");
  tempSvg.appendChild(path);
}

function clearTempConnection() {
  tempSvg.innerHTML = "";
}

function createConnection(from, fromSlot, to, toSlot) {
  if (from === to) {
    createToast("Conexión no válida", "No se puede conectar un nodo consigo mismo.");
    return;
  }

  const project = currentProject();
  const exists = project.connections.some(conn => conn.from === from && conn.fromSlot === fromSlot && conn.to === to && conn.toSlot === toSlot);
  if (exists) {
    createToast("Conexión duplicada", "Esa conexión ya existe.");
    return;
  }

  const occupied = project.connections.some(conn => conn.to === to && conn.toSlot === toSlot);
  if (occupied) {
    createToast("Entrada ocupada", "Esa entrada ya tiene una conexión.");
    return;
  }

  project.connections.push({
    id: "c" + state.connectionCounter++,
    from,
    fromSlot,
    to,
    toSlot
  });

  saveState();
  renderWorkspace();
  createToast("Conexión creada", `${fromSlot.toUpperCase()} conectado con ${toSlot.toUpperCase()}.`);
}

document.getElementById("btnResetView").addEventListener("click", () => {
  currentProject().view = { x: 60, y: 80, scale: 1 };
  updateWorldTransform();
  saveState();
});

document.getElementById("btnAutoArrange").addEventListener("click", () => {
  currentProject().nodes.forEach((node, index) => {
    node.x = 80 + (index % 3) * 310;
    node.y = 90 + Math.floor(index / 3) * 190;
  });
  renderWorkspace();
  saveState();
});

document.getElementById("btnClearWorkspace").addEventListener("click", () => {
  if (!confirm("¿Vaciar el proyecto actual?")) return;
  currentProject().nodes = [];
  currentProject().connections = [];
  state.selectedNodeId = null;
  state.selectedConnectionId = null;
  saveState();
  renderAll();
});

document.getElementById("btnNewProject").addEventListener("click", () => {
  const name = prompt("Nombre del nuevo proyecto:");
  if (!name) return;
  const id = "proyecto_" + Date.now();
  state.projects[id] = { id, name, view: { x: 60, y: 80, scale: 1 }, nodes: [], connections: [] };
  state.currentProjectId = id;
  saveState();
  renderAll();
});

document.getElementById("btnDuplicateProject").addEventListener("click", () => {
  const source = currentProject();
  const id = "proyecto_" + Date.now();
  state.projects[id] = structuredClone(source);
  state.projects[id].id = id;
  state.projects[id].name = source.name + " copia";
  state.currentProjectId = id;
  saveState();
  renderAll();
});

document.getElementById("btnDeleteProject").addEventListener("click", () => {
  const ids = Object.keys(state.projects);
  if (ids.length <= 1) {
    createToast("No permitido", "Debe existir al menos un proyecto.");
    return;
  }
  if (!confirm("¿Eliminar el proyecto actual?")) return;
  delete state.projects[state.currentProjectId];
  state.currentProjectId = Object.keys(state.projects)[0];
  state.selectedNodeId = null;
  state.selectedConnectionId = null;
  saveState();
  renderAll();
});

document.getElementById("btnExport").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(currentProject(), null, 2)], { type: "application/json" });
  downloadBlob(blob, `jocarsa-nodos-${currentProject().id}.json`);
});

document.getElementById("btnPseudo").addEventListener("click", () => showCode("pseudo"));
document.getElementById("btnPython").addEventListener("click", () => showCode("python"));
document.getElementById("btnJavaScript").addEventListener("click", () => showCode("javascript"));

function showCode(language) {
  state.lastLanguage = language;
  const code = compileProject(language);
  const titles = { pseudo: "Pseudocódigo", python: "Código Python", javascript: "Código JavaScript" };
  document.getElementById("codeDialogTitle").textContent = titles[language];
  document.getElementById("codeOutput").textContent = code;
  document.getElementById("codeDialog").showModal();
}

function compileProject(language) {
  const project = currentProject();
  const sorted = topologicalSort(project);
  const compiler = graphCompilers[language];

  const ctx = {
    project,
    lines: [],
    outputExpr: {},
    vars: new Set()
  };

  ctx.lines.push(...compiler.header(project));

  for (const node of sorted) {
    compileNode(node, compiler, ctx);
  }

  return ctx.lines.join("\n");
}

function compileNode(node, compiler, ctx) {
  const d = node.data || {};

  switch (node.kind) {
    case "declare": {
      const value = compiler.literal(d.value ?? "null");
      ctx.vars.add(d.name);
      ctx.outputExpr[node.id] = { out: d.name };
      ctx.lines.push(compiler.declare(d.name, value));
      return;
    }

    case "assign": {
      const input = getCompiledInput(node.id, "in", ctx);
      const value = input.exists ? input.expr : compiler.literal(d.value ?? "null");
      ctx.vars.add(d.name);
      ctx.outputExpr[node.id] = { out: d.name };
      ctx.lines.push(compiler.assign(d.name, value));
      return;
    }

    case "operation": {
      const leftInput = getCompiledInput(node.id, "left", ctx);
      const rightInput = getCompiledInput(node.id, "right", ctx);
      const left = leftInput.exists ? leftInput.expr : compiler.expr(d.left);
      const right = rightInput.exists ? rightInput.expr : compiler.expr(d.right);
      const expr = compiler.binary(left, d.operator, right);
      const target = d.target || `tmp_${node.id}`;
      ctx.vars.add(target);
      ctx.outputExpr[node.id] = { out: target };
      ctx.lines.push(compiler.assign(target, expr));
      return;
    }

    case "comparison": {
      const leftInput = getCompiledInput(node.id, "left", ctx);
      const rightInput = getCompiledInput(node.id, "right", ctx);
      const left = leftInput.exists ? leftInput.expr : compiler.expr(d.left);
      const right = rightInput.exists ? rightInput.expr : compiler.expr(d.right);
      const condition = compiler.binary(left, d.operator, right);
      const target = `cond_${node.id}`;
      ctx.vars.add(target);
      ctx.outputExpr[node.id] = {
        out: target,
        true: target,
        false: compiler.not(target)
      };
      ctx.lines.push(compiler.assign(target, condition));
      return;
    }

    case "print": {
      const input = getCompiledInput(node.id, "in", ctx);
      const value = input.exists ? input.expr : compiler.expr(d.value);
      ctx.outputExpr[node.id] = { out: value };
      ctx.lines.push(compiler.print(value));
      return;
    }

    case "if": {
      const input = getCompiledInput(node.id, "condition", ctx);
      const condition = input.exists ? input.expr : compiler.expr(d.condition);
      const target = `cond_${node.id}`;
      ctx.outputExpr[node.id] = {
        out: target,
        true: target,
        false: compiler.not(target)
      };
      ctx.lines.push(compiler.assign(target, condition));
      ctx.lines.push(compiler.comment(`IF ${condition} - ramas visuales TRUE/FALSE`));
      return;
    }

    case "while":
    case "for":
      ctx.outputExpr[node.id] = { out: "null" };
      ctx.lines.push(compiler.comment(`${node.kind.toUpperCase()} pendiente de compilación estructural avanzada`));
      return;

    default:
      ctx.lines.push(compiler.comment(`Nodo no soportado: ${node.kind}`));
  }
}

function getCompiledInput(nodeId, slotId, ctx) {
  const connection = ctx.project.connections.find(conn => conn.to === nodeId && conn.toSlot === slotId);

  if (!connection) {
    return { exists: false, expr: null };
  }

  const source = ctx.outputExpr[connection.from];

  if (!source || !(connection.fromSlot in source)) {
    return { exists: false, expr: null };
  }

  return { exists: true, expr: source[connection.fromSlot] };
}

const graphCompilers = {
  pseudo: {
    header: project => [`PROYECTO ${project.name}`, ``],
    literal: value => String(value),
    expr: value => String(value ?? ""),
    binary: (left, op, right) => `${left} ${op} ${right}`,
    not: expr => `NO (${expr})`,
    declare: (name, value) => `crear ${name} = ${value}`,
    assign: (name, value) => `${name} = ${value}`,
    print: value => `mostrar ${value}`,
    comment: text => `# ${text}`
  },

  python: {
    header: project => [`# ${project.name}`, `# Generado por jocarsa | nodos desde el grafo visual`, ``],
    literal: value => String(value ?? "None"),
    expr: value => String(value ?? "None"),
    binary: (left, op, right) => {
      const map = { "&&": "and", "||": "or", "===": "==", "!==": "!=" };
      return `${left} ${map[op] || op} ${right}`;
    },
    not: expr => `not (${expr})`,
    declare: (name, value) => `${name} = ${value}`,
    assign: (name, value) => `${name} = ${value}`,
    print: value => `print(${value})`,
    comment: text => `# ${text}`
  },

  javascript: {
    header: project => [`// ${project.name}`, `// Generado por jocarsa | nodos desde el grafo visual`, ``],
    literal: value => String(value ?? "null"),
    expr: value => String(value ?? "null"),
    binary: (left, op, right) => {
      const map = { "and": "&&", "or": "||" };
      return `${left} ${map[op] || op} ${right}`;
    },
    not: expr => `!(${expr})`,
    declare: (name, value) => `let ${name} = ${value};`,
    assign: (name, value) => `${name} = ${value};`,
    print: value => `console.log(${value});`,
    comment: text => `// ${text}`
  }
};

document.getElementById("btnPlay").addEventListener("click", runProject);
document.getElementById("btnClearConsole").addEventListener("click", () => {
  consoleOutput.innerHTML = '<span class="console-empty">Consola limpia.</span>';
});

function runProject() {
  const project = currentProject();
  const sorted = topologicalSort(project);
  const vars = {};
  const nodeOutputs = {};
  const output = [];

  try {
    for (const node of sorted) {
      const result = executeNode(node, vars, nodeOutputs, output);
      nodeOutputs[node.id] = normalizeOutputs(node, result);
    }

    if (output.length === 0) {
      output.push("(sin salida)");
    }

    consoleOutput.textContent = output.join("\n");
    createToast("Ejecución completada", "La salida se ha mostrado en consola.");
  } catch (error) {
    consoleOutput.textContent = "ERROR: " + error.message;
  }
}

function normalizeOutputs(node, result) {
  if (result && typeof result === "object" && result.__multiOutput) {
    return result.values;
  }

  return { out: result };
}

function executeNode(node, vars, nodeOutputs, output) {
  const d = node.data || {};

  switch (node.kind) {
    case "declare": {
      const value = evalExpression(d.value, vars);
      vars[d.name] = value;
      return value;
    }

    case "assign": {
      const incoming = getInputValue(node.id, "in", nodeOutputs);
      const value = incoming.exists ? incoming.value : evalExpression(d.value, vars);
      vars[d.name] = value;
      return value;
    }

    case "operation": {
      const leftInput = getInputValue(node.id, "left", nodeOutputs);
      const rightInput = getInputValue(node.id, "right", nodeOutputs);

      const left = leftInput.exists ? leftInput.value : evalExpression(d.left, vars);
      const right = rightInput.exists ? rightInput.value : evalExpression(d.right, vars);

      const value = applyOperator(left, d.operator, right);
      vars[d.target] = value;
      return value;
    }

    case "comparison": {
      const leftInput = getInputValue(node.id, "left", nodeOutputs);
      const rightInput = getInputValue(node.id, "right", nodeOutputs);

      const left = leftInput.exists ? leftInput.value : evalExpression(d.left, vars);
      const right = rightInput.exists ? rightInput.value : evalExpression(d.right, vars);

      const condition = Boolean(applyOperator(left, d.operator, right));
      const value = condition ? true : false;

      vars[`_${node.id}`] = value;

      return {
        __multiOutput: true,
        values: {
          true: condition ? value : undefined,
          false: condition ? undefined : value,
          out: value
        }
      };
    }

    case "if": {
      const conditionInput = getInputValue(node.id, "condition", nodeOutputs);
      const condition = Boolean(conditionInput.exists ? conditionInput.value : evalExpression(d.condition, vars));
      return {
        __multiOutput: true,
        values: {
          true: condition ? true : undefined,
          false: condition ? undefined : false,
          out: condition
        }
      };
    }

    case "print": {
      const incoming = getInputValue(node.id, "in", nodeOutputs);
      if (!incoming.exists || incoming.value === undefined) {
        return undefined;
      }
      output.push(String(incoming.value));
      return incoming.value;
    }

    case "while":
    case "for":
      output.push(`[${node.title}] simulación estructural pendiente`);
      return null;

    default:
      return null;
  }
}

function getInputValue(nodeId, slotId, nodeOutputs) {
  const project = currentProject();
  const connection = project.connections.find(conn => conn.to === nodeId && conn.toSlot === slotId);

  if (!connection) {
    return { exists: false, value: null };
  }

  const sourceOutputs = nodeOutputs[connection.from];
  if (!sourceOutputs) {
    return { exists: false, value: null };
  }

  return {
    exists: true,
    value: sourceOutputs[connection.fromSlot]
  };
}

function applyOperator(left, operator, right) {
  switch (operator) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return left / right;
    case "%": return left % right;
    case "==": return left == right;
    case "===": return left === right;
    case "!=": return left != right;
    case "!==": return left !== right;
    case ">": return left > right;
    case "<": return left < right;
    case ">=": return left >= right;
    case "<=": return left <= right;
    case "and": return Boolean(left) && Boolean(right);
    case "or": return Boolean(left) || Boolean(right);
    case "&&": return Boolean(left) && Boolean(right);
    case "||": return Boolean(left) || Boolean(right);
    default:
      throw new Error("Operador no soportado: " + operator);
  }
}

function evalExpression(expr, vars) {
  if (expr === undefined || expr === null) return null;
  if (typeof expr !== "string") return expr;

  const trimmed = expr.trim();
  if (trimmed === "") return "";

  if (/^[a-zA-Z_$][\w$]*$/.test(trimmed) && Object.prototype.hasOwnProperty.call(vars, trimmed)) {
    return vars[trimmed];
  }

  const names = Object.keys(vars);
  const values = Object.values(vars);
  return Function(...names, `"use strict"; return (${trimmed});`)(...values);
}

function topologicalSort(project) {
  const nodes = [...project.nodes];
  const incoming = new Map(nodes.map(node => [node.id, 0]));
  const outgoing = new Map(nodes.map(node => [node.id, []]));

  project.connections.forEach(conn => {
    if (!incoming.has(conn.to) || !outgoing.has(conn.from)) return;
    incoming.set(conn.to, incoming.get(conn.to) + 1);
    outgoing.get(conn.from).push(conn.to);
  });

  const queue = nodes.filter(node => incoming.get(node.id) === 0);
  const result = [];

  while (queue.length) {
    const node = queue.shift();
    result.push(node);
    outgoing.get(node.id).forEach(to => {
      incoming.set(to, incoming.get(to) - 1);
      if (incoming.get(to) === 0) {
        const next = nodes.find(node => node.id === to);
        if (next) queue.push(next);
      }
    });
  }

  nodes.forEach(node => {
    if (!result.includes(node)) result.push(node);
  });

  return result;
}

document.getElementById("btnCloseDialog").addEventListener("click", () => {
  document.getElementById("codeDialog").close();
});

document.getElementById("btnCopyCode").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.getElementById("codeOutput").textContent);
  createToast("Código copiado", "El código se ha copiado al portapapeles.");
});

document.getElementById("btnDownloadCode").addEventListener("click", () => {
  const ext = state.lastLanguage === "python" ? "py" : state.lastLanguage === "javascript" ? "js" : "txt";
  const blob = new Blob([document.getElementById("codeOutput").textContent], { type: "text/plain" });
  downloadBlob(blob, `${currentProject().id}.${ext}`);
});

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

window.addEventListener("keydown", event => {
  if (event.key !== "Delete" && event.key !== "Backspace") return;
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

  const project = currentProject();

  if (state.selectedNodeId) {
    project.nodes = project.nodes.filter(node => node.id !== state.selectedNodeId);
    project.connections = project.connections.filter(conn => conn.from !== state.selectedNodeId && conn.to !== state.selectedNodeId);
    state.selectedNodeId = null;
    saveState();
    renderAll();
    return;
  }

  if (state.selectedConnectionId) {
    project.connections = project.connections.filter(conn => conn.id !== state.selectedConnectionId);
    state.selectedConnectionId = null;
    saveState();
    renderAll();
  }
});

document.getElementById("btnClearSearch").addEventListener("click", () => {
  document.getElementById("search-input").value = "";
  applySearch();
});

document.getElementById("btnSearch").addEventListener("click", applySearch);
document.getElementById("search-input").addEventListener("input", applySearch);

function applySearch() {
  const q = document.getElementById("search-input").value.trim().toLowerCase();
  document.querySelectorAll(".palette-node, .project-item").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(q) ? "" : "none";
  });
}

function updateProjectCounts() {
  document.querySelectorAll(".project-item").forEach(link => {
    const project = state.projects[link.dataset.project];
    const count = link.querySelector(".folder-count");
    if (project && count) count.textContent = project.nodes.length;
  });
}

function createToast(title, text) {
  const stack = document.getElementById("toastStack");
  const toast = document.createElement("article");
  toast.className = "ju-toast chaflan";
  toast.innerHTML = `
    <div class="ju-toast-icon chaflan">i</div>
    <div>
      <p class="ju-toast-title">${title}</p>
      <p class="ju-toast-text">${text}</p>
    </div>
    <button class="ju-toast-close" type="button" aria-label="Cerrar">×</button>
  `;

  const close = () => {
    toast.classList.add("is-leaving");
    setTimeout(() => toast.remove(), 220);
  };

  toast.querySelector(".ju-toast-close").addEventListener("click", close);
  stack.appendChild(toast);
  setTimeout(close, 4200);
}

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadState();
renderAll();
createToast("jocarsa | nodos", "Prototipo v6 cargado.");
