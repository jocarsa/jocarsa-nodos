const STORAGE_KEY = "jocarsa_nodos_projects_v19_compact_ports";

const NODE_WIDTH = 210;
const NODE_HEADER_HEIGHT = 40;
const NODE_FOOTER_HEIGHT = 22;
const PORT_SPACING = 22;
const MIN_NODE_HEIGHT = 84;

const defaultProjects = {
  demo: {
    id: "demo",
    name: "Funciones y listas",
    activeTab: "main",
    tabs: {
      main: {
        id: "main",
        name: "main",
        type: "main",
        view: { x: 80, y: 90, scale: 1 },
        nodes: [
          { id: "n1", kind: "start", title: "Inicio", data: {}, x: 80, y: 160 },
          { id: "n2", kind: "list", title: "Lista", data: { name: "numeros", values: "1,2,3" }, x: 300, y: 80 },
          { id: "n3", kind: "function_call", title: "contar", data: { functionName: "contar", target: "resultado" }, x: 520, y: 160 },
          { id: "n4", kind: "print", title: "Mostrar", data: { value: "resultado" }, x: 760, y: 160 }
        ],
        connections: [
          { id: "c1", type: "flow", from: "n1", fromSlot: "flowOut", to: "n3", toSlot: "flowIn" },
          { id: "c2", type: "data", from: "n2", fromSlot: "out", to: "n3", toSlot: "arg0" },
          { id: "c3", type: "flow", from: "n3", fromSlot: "flowOut", to: "n4", toSlot: "flowIn" },
          { id: "c4", type: "data", from: "n3", fromSlot: "out", to: "n4", toSlot: "value" }
        ]
      },
      fn_contar: {
        id: "fn_contar",
        name: "contar",
        type: "function",
        params: "entrada",
        returnValue: "resultado",
        view: { x: 80, y: 90, scale: 1 },
        nodes: [
          { id: "n5", kind: "start", title: "Inicio función", data: {}, x: 80, y: 160 },
          { id: "n6", kind: "list_length", title: "Longitud", data: { list: "entrada", target: "resultado" }, x: 330, y: 160 },
          { id: "n7", kind: "return", title: "Return", data: { value: "resultado" }, x: 590, y: 160 }
        ],
        connections: [
          { id: "c5", type: "flow", from: "n5", fromSlot: "flowOut", to: "n6", toSlot: "flowIn" },
          { id: "c6", type: "flow", from: "n6", fromSlot: "flowOut", to: "n7", toSlot: "flowIn" },
          { id: "c7", type: "data", from: "n6", fromSlot: "out", to: "n7", toSlot: "value" }
        ]
      }
    }
  }
};

const nodeTypes = {
  start: {
    className: "color-warning",
    flowInputs: [],
    flowOutputs: [{ id: "flowOut", label: "FLOW" }],
    dataInputs: [],
    dataOutputs: []
  },
  declare: {
    className: "color-accent",
    flowInputs: [],
    flowOutputs: [],
    dataInputs: [],
    dataOutputs: [{ id: "out", label: "VAL" }]
  },
  assign: {
    className: "color-blue",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [{ id: "flowOut", label: "NEXT" }],
    dataInputs: [{ id: "value", label: "VAL" }],
    dataOutputs: [{ id: "out", label: "VAL" }]
  },
  operation: {
    className: "color-green",
    flowInputs: [],
    flowOutputs: [],
    dataInputs: [{ id: "left", label: "A" }, { id: "right", label: "B" }],
    dataOutputs: [{ id: "out", label: "VAL" }]
  },
  comparison: {
    className: "color-purple",
    flowInputs: [],
    flowOutputs: [],
    dataInputs: [{ id: "left", label: "A" }, { id: "right", label: "B" }],
    dataOutputs: [{ id: "out", label: "BOOL" }]
  },
  boolean: {
    className: "color-purple",
    flowInputs: [],
    flowOutputs: [],
    dataInputs: [{ id: "left", label: "A" }, { id: "right", label: "B" }],
    dataOutputs: [{ id: "out", label: "BOOL" }]
  },
  if: {
    className: "color-warning",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [{ id: "true", label: "TRUE" }, { id: "false", label: "FALSE" }],
    dataInputs: [{ id: "condition", label: "COND" }],
    dataOutputs: []
  },
  for: {
    className: "color-accent",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [{ id: "body", label: "BODY" }, { id: "exit", label: "EXIT" }],
    dataInputs: [],
    dataOutputs: [{ id: "iter", label: "i" }]
  },
  list: {
    className: "color-blue",
    flowInputs: [],
    flowOutputs: [],
    dataInputs: [],
    dataOutputs: [{ id: "out", label: "LIST" }]
  },
  list_get: {
    className: "color-blue",
    flowInputs: [],
    flowOutputs: [],
    dataInputs: [{ id: "list", label: "LIST" }, { id: "index", label: "IDX" }],
    dataOutputs: [{ id: "out", label: "VAL" }]
  },
  list_push: {
    className: "color-blue",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [{ id: "flowOut", label: "NEXT" }],
    dataInputs: [{ id: "list", label: "LIST" }, { id: "value", label: "VAL" }],
    dataOutputs: [{ id: "out", label: "LIST" }]
  },
  list_length: {
    className: "color-blue",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [{ id: "flowOut", label: "NEXT" }],
    dataInputs: [{ id: "list", label: "LIST" }],
    dataOutputs: [{ id: "out", label: "LEN" }]
  },
  function_call: {
    className: "color-blue",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [{ id: "flowOut", label: "NEXT" }],
    dataInputs: [{ id: "arg0", label: "ARG" }],
    dataOutputs: [{ id: "out", label: "RET" }]
  },
  return: {
    className: "color-warning",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [],
    dataInputs: [{ id: "value", label: "VAL" }],
    dataOutputs: []
  },
  print: {
    className: "color-green",
    flowInputs: [{ id: "flowIn", label: "IN" }],
    flowOutputs: [{ id: "flowOut", label: "NEXT" }],
    dataInputs: [{ id: "value", label: "VAL" }],
    dataOutputs: []
  }
};

let state = {
  projects: {},
  currentProjectId: "demo",
  selectedNodeId: null,
  selectedConnectionId: null,
  nodeCounter: 100,
  connectionCounter: 100,
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
const dynamicInspector = document.getElementById("dynamicInspector");
const formDialog = document.getElementById("formDialog");
const formDialogTitle = document.getElementById("formDialogTitle");
const formDialogBody = document.getElementById("formDialogBody");
const modalForm = document.getElementById("modalForm");
const btnCloseFormDialog = document.getElementById("btnCloseFormDialog");
const btnCancelFormDialog = document.getElementById("btnCancelFormDialog");

function currentProject() {
  return state.projects[state.currentProjectId];
}

function currentTab() {
  const project = currentProject();
  project.activeTab ||= "main";
  return project.tabs[project.activeTab];
}

function getNodeType(node) {
  if (node.kind === "start" && currentTab()?.type === "function") {
    const params = getFunctionParams(currentTab());
    return {
      className: "color-warning",
      flowInputs: [],
      flowOutputs: [{ id: "flowOut", label: "FLOW" }],
      dataInputs: [],
      dataOutputs: params.map((param, index) => ({ id: "param" + index, label: param }))
    };
  }

  if (node.kind === "function_call") {
    const fn = getFunctionTab(node.data?.functionName);
    const params = getFunctionParams(fn);
    return {
      className: "color-blue",
      flowInputs: [{ id: "flowIn", label: "IN" }],
      flowOutputs: [{ id: "flowOut", label: "NEXT" }],
      dataInputs: params.map((param, index) => ({ id: "arg" + index, label: param || ("ARG" + index) })),
      dataOutputs: [{ id: "out", label: "RET" }]
    };
  }

  return nodeTypes[node.kind] || nodeTypes.declare;
}

function getFunctionParams(tab) {
  if (!tab) return ["entrada"];
  return String(tab.params || "entrada")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function getCurrentFunctionMeta() {
  const tab = currentTab();
  if (tab.type !== "function") return null;
  return {
    name: tab.name,
    params: getFunctionParams(tab),
    returnValue: tab.returnValue || "resultado"
  };
}

function getNode(id, tab = currentTab()) {
  return tab.nodes.find(node => node.id === id);
}

function getFunctionTab(functionName) {
  return Object.values(currentProject().tabs).find(tab => tab.type === "function" && tab.name === functionName);
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
    state.currentProjectId = parsed.currentProjectId || "demo";
    state.nodeCounter = parsed.nodeCounter || 100;
    state.connectionCounter = parsed.connectionCounter || 100;
  } catch {
    state.projects = structuredClone(defaultProjects);
  }
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
        <span class="folder-count">${countProjectNodes(project)}</span>
      </span>
    `;

    link.addEventListener("click", event => {
      event.preventDefault();
      state.currentProjectId = project.id;
      clearSelection();
      saveState();
      renderAll();
    });

    projectsList.appendChild(link);
  });
}

function countProjectNodes(project) {
  return Object.values(project.tabs || {}).reduce((total, tab) => total + tab.nodes.length, 0);
}

function renderTabs() {
  const bar = document.getElementById("tabsBar");
  bar.innerHTML = "";
  const project = currentProject();

  Object.values(project.tabs).forEach(tab => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tab-btn ${tab.type === "function" ? "function-tab" : ""} ${project.activeTab === tab.id ? "active" : ""}`;
    btn.textContent = tab.name;
    btn.addEventListener("click", () => {
      project.activeTab = tab.id;
      clearSelection();
      saveState();
      renderAll();
    });
    bar.appendChild(btn);
  });

  renderFunctionPalette();
}

function renderFunctionPalette() {
  const holder = document.getElementById("functionPalette");
  holder.innerHTML = "";

  Object.values(currentProject().tabs)
    .filter(tab => tab.type === "function")
    .forEach(tab => {
      const article = document.createElement("article");
      article.className = "palette-node function-palette color-blue";
      article.draggable = true;
      article.dataset.kind = "function_call";
      article.dataset.title = tab.name;
      article.dataset.json = JSON.stringify({ functionName: tab.name, target: tab.returnValue || "resultado" });
      const params = getFunctionParams(tab).join(", ");
      article.innerHTML = `<a href="#"><div class="asunto-linea"><h3>${escapeHtml(tab.name)}</h3><span class="badge-thread">fn</span></div><p>(${escapeHtml(params)}) → ${escapeHtml(tab.returnValue || "resultado")}</p></a>`;
      registerPaletteNode(article);
      holder.appendChild(article);
    });
}

function renderWorkspace() {
  const tab = currentTab();
  nodesLayer.innerHTML = "";
  connectionsSvg.innerHTML = "";
  tempSvg.innerHTML = "";
  hint.classList.toggle("hidden", tab.nodes.length > 0);

  tab.connections.forEach(drawConnection);
  tab.nodes.forEach(drawNode);
  renderTabs();
  updateProjectCounts();
}

function drawNode(node) {
  const type = getNodeType(node);
  const totalPorts = type.flowInputs.length + type.flowOutputs.length + type.dataInputs.length + type.dataOutputs.length;

  const el = document.createElement("article");
  el.className = `node-card ${totalPorts > 3 ? "has-many-ports" : ""} ${type.className} ${node.id === state.selectedNodeId ? "selected" : ""}`;
  el.dataset.id = node.id;
  el.style.left = `${node.x}px`;
  el.style.top = `${node.y}px`;

  const leftPorts = [
    ...type.flowInputs.map(port => ({ ...port, direction: "input", type: "flow" })),
    ...type.dataInputs.map(port => ({ ...port, direction: "input", type: "data" }))
  ];

  const rightPorts = [
    ...type.flowOutputs.map(port => ({ ...port, direction: "output", type: "flow" })),
    ...type.dataOutputs.map(port => ({ ...port, direction: "output", type: "data" }))
  ];

  const nodeHeight = getNodeHeightForPorts(leftPorts, rightPorts);
  const compactPorts = Math.max(leftPorts.length, rightPorts.length) > 4;

  const ports = [
    ...distributePorts(leftPorts, nodeHeight).map(port => slotHtml(port)),
    ...distributePorts(rightPorts, nodeHeight).map(port => slotHtml(port))
  ].join("");

  el.style.setProperty("--node-real-height", `${nodeHeight}px`);
  el.style.setProperty("height", `${nodeHeight}px`, "important");
  el.style.setProperty("min-height", `${nodeHeight}px`, "important");
  el.classList.toggle("compact-ports", compactPorts);

  el.innerHTML = `
    ${ports}
    <div class="node-title">${escapeHtml(node.title)}</div>
    <div class="node-mini">${escapeHtml(previewNode(node))}</div>
  `;

  el.querySelectorAll(".slot").forEach(slot => {
    slot.dataset.node = node.id;
  });

  el.addEventListener("pointerdown", startNodeDrag);
  el.addEventListener("click", event => {
    event.stopPropagation();
    selectNode(node.id);
  });

  el.querySelectorAll(".slot.output").forEach(slot => {
    slot.addEventListener("pointerdown", startConnection);
  });

  nodesLayer.appendChild(el);
}

function getNodeHeightForPorts(leftPorts, rightPorts) {
  const maxPorts = Math.max(leftPorts.length, rightPorts.length, 1);
  const compactPorts = Math.min(maxPorts, 6);
  const compactBlock = Math.max(0, compactPorts - 1) * PORT_SPACING;
  const overflow = Math.max(0, maxPorts - 6) * 18;

  return Math.max(
    MIN_NODE_HEIGHT,
    NODE_HEADER_HEIGHT + NODE_FOOTER_HEIGHT + compactBlock + overflow
  );
}

function distributePorts(ports, nodeHeight) {
  if (ports.length === 0) return [];

  if (ports.length === 1) {
    return ports.map(port => ({ ...port, top: Math.round(nodeHeight / 2) }));
  }

  if (ports.length <= 6) {
    const spacing = PORT_SPACING;
    const blockHeight = (ports.length - 1) * spacing;
    const start = Math.round((nodeHeight - blockHeight) / 2);

    return ports.map((port, index) => ({
      ...port,
      top: start + index * spacing
    }));
  }

  const topLimit = 34;
  const bottomLimit = Math.max(topLimit, nodeHeight - 34);
  const step = (bottomLimit - topLimit) / (ports.length - 1);

  return ports.map((port, index) => ({
    ...port,
    top: Math.round(topLimit + index * step)
  }));
}

function slotHtml(port) {
  const label = shouldShowPortLabel(port) ? escapeHtml(port.label) : "";
  const labelHtml = label
    ? `<div class="port-label ${port.direction}-label ${port.type}-label" style="top:${port.top}px">${label}</div>`
    : "";

  return `
    <div class="slot ${port.direction} ${port.type}" data-direction="${port.direction}" data-type="${port.type}" data-slot-id="${port.id}" data-label="${escapeHtml(port.label)}" title="${port.type} ${escapeHtml(port.label)}" style="top:${port.top}px"></div>
    ${labelHtml}
  `;
}

function shouldShowPortLabel(port) {
  const generic = new Set([
    "FLOW", "IN", "NEXT", "RET", "VAL", "BOOL", "LIST", "LEN", "IDX", "ARG", "BODY", "EXIT", "TRUE", "FALSE"
  ]);

  if (generic.has(String(port.label).toUpperCase())) return false;
  return true;
}

function previewNode(node) {
  const d = node.data || {};
  switch (node.kind) {
    case "start": return currentTab()?.type === "function" ? "parámetros → datos" : "inicio";
    case "declare": return `${d.name ?? "var"} = ${d.value ?? ""}`;
    case "assign": return `${d.name ?? "var"} ← valor`;
    case "operation": return `${d.target ?? "resultado"} = A ${d.operator ?? "+"} B`;
    case "comparison": return `A ${d.operator ?? ">"} B`;
    case "boolean": return `A ${d.operator ?? "and"} B`;
    case "if": return "COND → TRUE/FALSE";
    case "for": return `${d.iterator ?? "i"}: ${d.from ?? 0}..${d.to ?? 10}`;
    case "list": return `${d.name ?? "lista"} = [${d.values ?? ""}]`;
    case "list_get": return `${d.target ?? "x"} = lista[i]`;
    case "list_push": return "lista + valor";
    case "list_length": return `${d.target ?? "n"} = len(lista)`;
    case "function_call": return `${d.functionName ?? "fn"}(...)`;
    case "return": return "return";
    case "print": return "mostrar";
    default: return node.kind;
  }
}

function drawConnection(connection) {
  const tab = currentTab();
  const from = getNode(connection.from, tab);
  const to = getNode(connection.to, tab);
  if (!from || !to) return;

  const p1 = outputPoint(from, connection.fromSlot, connection.type);
  const p2 = inputPoint(to, connection.toSlot, connection.type);
  const path = createPath(p1.x, p1.y, p2.x, p2.y);
  path.classList.add("connection-path", connection.type === "flow" ? "flow-path" : "data-path");
  if (connection.id === state.selectedConnectionId) path.classList.add("selected");

  path.dataset.id = connection.id;
  path.addEventListener("click", event => {
    event.stopPropagation();
    state.selectedConnectionId = connection.id;
    state.selectedNodeId = null;
    renderWorkspace();
    renderInspector();
  });

  connectionsSvg.appendChild(path);
}

function createPath(x1, y1, x2, y2) {
  const mid = Math.max(60, Math.abs(x2 - x1) / 2);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`);
  return path;
}

function getNodePortGroups(node) {
  const type = getNodeType(node);

  const leftPorts = [
    ...type.flowInputs.map(port => ({ ...port, direction: "input", type: "flow" })),
    ...type.dataInputs.map(port => ({ ...port, direction: "input", type: "data" }))
  ];

  const rightPorts = [
    ...type.flowOutputs.map(port => ({ ...port, direction: "output", type: "flow" })),
    ...type.dataOutputs.map(port => ({ ...port, direction: "output", type: "data" }))
  ];

  const nodeHeight = getNodeHeightForPorts(leftPorts, rightPorts);

  return {
    leftPorts: distributePorts(leftPorts, nodeHeight),
    rightPorts: distributePorts(rightPorts, nodeHeight),
    nodeHeight
  };
}

function outputPoint(node, slotId, connectionType) {
  const { rightPorts } = getNodePortGroups(node);
  const slot = rightPorts.find(port => port.type === connectionType && port.id === slotId) || { top: Math.round(MIN_NODE_HEIGHT / 2) };
  return { x: node.x + NODE_WIDTH, y: node.y + slot.top };
}

function inputPoint(node, slotId, connectionType) {
  const { leftPorts } = getNodePortGroups(node);
  const slot = leftPorts.find(port => port.type === connectionType && port.id === slotId) || { top: Math.round(MIN_NODE_HEIGHT / 2) };
  return { x: node.x, y: node.y + slot.top };
}

function clearSelection() {
  state.selectedNodeId = null;
  state.selectedConnectionId = null;
}

function selectNode(id) {
  state.selectedNodeId = id;
  state.selectedConnectionId = null;
  renderWorkspace();
  renderInspector();
}

function renderInspector() {
  const node = state.selectedNodeId ? getNode(state.selectedNodeId) : null;
  nodeTitle.value = node ? node.title : "";
  nodeKind.value = node ? node.kind : "";
  nodeId.value = node ? node.id : "";
  nodeData.value = node ? JSON.stringify(node.data, null, 2) : "";
  [nodeTitle, nodeData].forEach(input => input.disabled = !node);
  renderDynamicInspector(node);
}

function renderDynamicInspector(node) {
  dynamicInspector.innerHTML = "";
  if (!node) {
    const meta = getCurrentFunctionMeta();
    if (meta) {
      dynamicInspector.innerHTML = `
        <div class="function-meta">
          <strong>Función actual: ${escapeHtml(meta.name)}</strong>
          Parámetros:
          <div class="param-list">${meta.params.map(p => `<span class="param-pill">${escapeHtml(p)}</span>`).join("")}</div>
          Devuelve: <strong>${escapeHtml(meta.returnValue)}</strong>
        </div>
        <p class="ju-subtle">Selecciona un nodo o pulsa “Editar función actual”.</p>
      `;
    } else {
      dynamicInspector.innerHTML = `<p class="ju-subtle">Selecciona un nodo para editar.</p>`;
    }
    return;
  }

  const d = node.data || {};

  if (node.kind === "start") {
    const meta = getCurrentFunctionMeta();
    if (meta) {
      dynamicInspector.innerHTML = `
        <div class="function-meta">
          <strong>Inicio de función</strong>
          Cada parámetro aparece como salida de datos azul.
          <div class="param-list">${meta.params.map(p => `<span class="param-pill">${escapeHtml(p)}</span>`).join("")}</div>
          <div class="param-output-note">Conecta estas salidas a operaciones, comparaciones, listas o Return.</div>
        </div>
      `;
    } else {
      dynamicInspector.innerHTML = `<p class="ju-subtle">Nodo de entrada del programa.</p>`;
    }
  } else if (node.kind === "declare") {
    dynamicInspector.innerHTML = fieldHtml("Nombre", "name", d.name ?? "") + fieldHtml("Valor", "value", d.value ?? "");
  } else if (node.kind === "assign") {
    dynamicInspector.innerHTML = fieldHtml("Nombre", "name", d.name ?? "") + fieldHtml("Valor", "value", d.value ?? "", isInputConnected(node.id, "value", "data"));
  } else if (node.kind === "operation") {
    dynamicInspector.innerHTML = fieldHtml("Guardar en", "target", d.target ?? "resultado") + binaryEditor(node, d, ["+","-","*","/","%"]);
  } else if (node.kind === "comparison") {
    dynamicInspector.innerHTML = binaryEditor(node, d, [">","<",">=","<=","==","!=","===","!=="]);
  } else if (node.kind === "boolean") {
    dynamicInspector.innerHTML = binaryEditor(node, d, ["and","or","&&","||"]);
  } else if (node.kind === "if") {
    dynamicInspector.innerHTML = fieldHtml("Condición", "condition", d.condition ?? "true", isInputConnected(node.id, "condition", "data"));
  } else if (node.kind === "for") {
    dynamicInspector.innerHTML =
      fieldHtml("Iterador", "iterator", d.iterator ?? "i") +
      fieldHtml("Desde", "from", d.from ?? "0") +
      fieldHtml("Hasta", "to", d.to ?? "10") +
      fieldHtml("Paso", "step", d.step ?? "1");
  } else if (node.kind === "list") {
    dynamicInspector.innerHTML = fieldHtml("Nombre", "name", d.name ?? "lista") + fieldHtml("Valores separados por coma", "values", d.values ?? "1,2,3");
  } else if (node.kind === "list_get") {
    dynamicInspector.innerHTML =
      fieldHtml("Lista", "list", d.list ?? "lista", isInputConnected(node.id, "list", "data")) +
      fieldHtml("Índice", "index", d.index ?? "0", isInputConnected(node.id, "index", "data")) +
      fieldHtml("Guardar en", "target", d.target ?? "elemento");
  } else if (node.kind === "list_push") {
    dynamicInspector.innerHTML =
      fieldHtml("Lista", "list", d.list ?? "lista", isInputConnected(node.id, "list", "data")) +
      fieldHtml("Valor", "value", d.value ?? "valor", isInputConnected(node.id, "value", "data"));
  } else if (node.kind === "list_length") {
    dynamicInspector.innerHTML =
      fieldHtml("Lista", "list", d.list ?? "lista", isInputConnected(node.id, "list", "data")) +
      fieldHtml("Guardar en", "target", d.target ?? "longitud");
  } else if (node.kind === "function_call") {
    const fn = getFunctionTab(d.functionName);
    const params = getFunctionParams(fn);
    const paramFields = params.map((param, index) => {
      const prop = "arg" + index;
      const locked = isInputConnected(node.id, prop, "data");
      return fieldHtml("Argumento " + param, prop, d[prop] ?? param, locked);
    }).join("");
    dynamicInspector.innerHTML =
      fieldHtml("Función", "functionName", d.functionName ?? "") +
      fieldHtml("Guardar retorno en", "target", d.target ?? (fn?.returnValue || "resultado")) +
      paramFields;
  } else if (node.kind === "return") {
    dynamicInspector.innerHTML = fieldHtml("Valor devuelto", "value", d.value ?? "resultado", isInputConnected(node.id, "value", "data"));
  } else if (node.kind === "print") {
    dynamicInspector.innerHTML = fieldHtml("Valor a mostrar", "value", d.value ?? "mensaje", isInputConnected(node.id, "value", "data"));
  }

  dynamicInspector.querySelectorAll("[data-prop]").forEach(input => {
    input.addEventListener("input", event => updateNodeProperty(event.target.dataset.prop, event.target.value));
  });
}

function binaryEditor(node, d, operators) {
  return `<div class="smart-grid">
    ${fieldHtml("A", "left", d.left ?? "a", isInputConnected(node.id, "left", "data"))}
    ${operatorHtml(d.operator ?? operators[0], operators)}
    ${fieldHtml("B", "right", d.right ?? "b", isInputConnected(node.id, "right", "data"))}
  </div>`;
}

function fieldHtml(label, prop, value, disabled = false) {
  return `<label class="smart-field"><span>${label}</span><input type="text" data-prop="${prop}" value="${escapeHtml(value)}" ${disabled ? "disabled" : ""}>${disabled ? `<span class="lock-note">Conectado.</span>` : ""}</label>`;
}

function operatorHtml(value, operators) {
  return `<label class="smart-field"><span>Operador</span><select data-prop="operator">${operators.map(op => `<option value="${escapeHtml(op)}" ${op === value ? "selected" : ""}>${escapeHtml(op)}</option>`).join("")}</select></label>`;
}

function isInputConnected(nodeId, slotId, type) {
  return currentTab().connections.some(conn => conn.type === type && conn.to === nodeId && conn.toSlot === slotId);
}

function updateNodeProperty(prop, value) {
  const node = getNode(state.selectedNodeId);
  if (!node) return;
  node.data ||= {};
  node.data[prop] = value;
  nodeData.value = JSON.stringify(node.data, null, 2);
  saveState();
  renderWorkspace();
}

function updateSelectedNode() {
  const node = getNode(state.selectedNodeId);
  if (!node) return;
  node.title = nodeTitle.value;
  try {
    node.data = JSON.parse(nodeData.value || "{}");
    nodeData.style.borderColor = "";
  } catch {
    nodeData.style.borderColor = "#ef4444";
    return;
  }
  saveState();
  renderWorkspace();
  renderDynamicInspector(node);
}

nodeTitle.addEventListener("input", updateSelectedNode);
nodeData.addEventListener("input", updateSelectedNode);

document.querySelectorAll(".palette-node").forEach(registerPaletteNode);

function registerPaletteNode(item) {
  item.addEventListener("dragstart", event => {
    item.classList.add("dragging");
    event.dataTransfer.setData("application/json", JSON.stringify({
      kind: item.dataset.kind,
      title: item.dataset.title,
      data: JSON.parse(item.dataset.json || "{}")
    }));
  });

  item.addEventListener("dragend", () => item.classList.remove("dragging"));
}

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
  addNode({ ...data, x: Math.max(0, p.x - 115), y: Math.max(0, p.y - 24) });
});

function addNode(data) {
  const node = { id: "n" + state.nodeCounter++, kind: data.kind, title: data.title, data: data.data || {}, x: data.x, y: data.y };
  currentTab().nodes.push(node);
  saveState();
  selectNode(node.id);
}

function startNodeDrag(event) {
  if (event.target.classList.contains("slot")) return;
  const node = getNode(event.currentTarget.dataset.id);
  if (!node) return;
  event.stopPropagation();
  selectNode(node.id);
  state.draggingNode = { node, start: screenToWorld(event.clientX, event.clientY), originalX: node.x, originalY: node.y };
  event.currentTarget.setPointerCapture(event.pointerId);
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
    const tab = currentTab();
    tab.view.x = state.panning.originalX + event.clientX - state.panning.startX;
    tab.view.y = state.panning.originalY + event.clientY - state.panning.startY;
    updateWorldTransform();
  }
});

window.addEventListener("pointerup", event => {
  if (state.connecting) {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const input = target?.closest?.(".slot.input");

    if (input && input.dataset.type === state.connecting.type) {
      createConnection(state.connecting.from, state.connecting.fromSlot, input.dataset.node, input.dataset.slotId, state.connecting.type);
    }

    clearTempConnection();
    workspace.classList.remove("connecting-flow", "connecting-data");
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
  clearSelection();
  renderWorkspace();
  renderInspector();
  const tab = currentTab();
  state.panning = { startX: event.clientX, startY: event.clientY, originalX: tab.view.x, originalY: tab.view.y };
  workspace.classList.add("panning");
});

workspace.addEventListener("wheel", event => {
  event.preventDefault();
  const tab = currentTab();
  const before = screenToWorld(event.clientX, event.clientY);
  tab.view.scale = clamp(tab.view.scale * (event.deltaY > 0 ? 0.9 : 1.1), 0.35, 2.2);
  const after = screenToWorld(event.clientX, event.clientY);
  tab.view.x += (after.x - before.x) * tab.view.scale;
  tab.view.y += (after.y - before.y) * tab.view.scale;
  updateWorldTransform();
  saveState();
}, { passive: false });

function updateWorldTransform() {
  const tab = currentTab();
  tab.view ||= { x: 80, y: 90, scale: 1 };
  world.style.transform = `translate(${tab.view.x}px, ${tab.view.y}px) scale(${tab.view.scale})`;
  zoomIndicator.textContent = `${Math.round(tab.view.scale * 100)}%`;
}

function screenToWorld(clientX, clientY) {
  const rect = workspace.getBoundingClientRect();
  const view = currentTab().view;
  return { x: (clientX - rect.left - view.x) / view.scale, y: (clientY - rect.top - view.y) / view.scale };
}

function startConnection(event) {
  event.preventDefault();
  event.stopPropagation();
  const slot = event.currentTarget;
  const node = getNode(slot.dataset.node);
  if (!node) return;
  const type = slot.dataset.type;
  state.connecting = { from: node.id, fromSlot: slot.dataset.slotId, type, start: outputPoint(node, slot.dataset.slotId, type) };
  workspace.classList.add(type === "flow" ? "connecting-flow" : "connecting-data");
  updateTempConnection(event.clientX, event.clientY);
}

function updateTempConnection(clientX, clientY) {
  tempSvg.innerHTML = "";
  if (!state.connecting) return;
  const end = screenToWorld(clientX, clientY);
  const path = createPath(state.connecting.start.x, state.connecting.start.y, end.x, end.y);
  path.classList.add("temp-path", state.connecting.type === "flow" ? "flow-path" : "data-path");
  tempSvg.appendChild(path);
}

function clearTempConnection() {
  tempSvg.innerHTML = "";
}

function createConnection(from, fromSlot, to, toSlot, type) {
  if (from === to) return createToast("Conexión no válida", "No se puede conectar un nodo consigo mismo.");

  const tab = currentTab();
  const exists = tab.connections.some(conn => conn.type === type && conn.from === from && conn.fromSlot === fromSlot && conn.to === to && conn.toSlot === toSlot);
  if (exists) return createToast("Conexión duplicada", "Esa conexión ya existe.");

  const occupied = tab.connections.some(conn => conn.type === type && conn.to === to && conn.toSlot === toSlot);
  if (occupied) return createToast("Entrada ocupada", "Esa entrada ya tiene una conexión.");

  tab.connections.push({ id: "c" + state.connectionCounter++, type, from, fromSlot, to, toSlot });
  saveState();
  renderWorkspace();
  renderInspector();
}


function openFormDialog(title, fields, onSubmit) {
  formDialogTitle.textContent = title;
  formDialogBody.innerHTML = fields.map(field => `
    <label class="modal-field">
      <span>${escapeHtml(field.label)}</span>
      ${field.help ? `<small>${escapeHtml(field.help)}</small>` : ""}
      <input type="text" name="${escapeHtml(field.name)}" value="${escapeHtml(field.value ?? "")}" ${field.required ? "required" : ""}>
    </label>
  `).join("");

  const close = () => formDialog.close();
  btnCloseFormDialog.onclick = close;
  btnCancelFormDialog.onclick = close;

  modalForm.onsubmit = event => {
    event.preventDefault();
    const data = {};
    new FormData(modalForm).forEach((value, key) => data[key] = String(value));
    formDialog.close();
    onSubmit(data);
  };

  formDialog.showModal();
  const first = formDialogBody.querySelector("input");
  if (first) first.focus();
}

document.getElementById("btnResetView").addEventListener("click", () => {
  currentTab().view = { x: 80, y: 90, scale: 1 };
  updateWorldTransform();
  saveState();
});

document.getElementById("btnAutoArrange").addEventListener("click", () => {
  currentTab().nodes.forEach((node, index) => {
    node.x = 80 + (index % 3) * 320;
    node.y = 100 + Math.floor(index / 4) * 130;
  });
  renderWorkspace();
  saveState();
});

document.getElementById("btnClearWorkspace").addEventListener("click", () => {
  if (!confirm("¿Vaciar la pestaña actual?")) return;
  currentTab().nodes = [];
  currentTab().connections = [];
  clearSelection();
  saveState();
  renderAll();
});

document.getElementById("btnNewProject").addEventListener("click", () => {
  openFormDialog("Nuevo proyecto", [
    { name: "name", label: "Nombre del proyecto", value: "Nuevo proyecto", required: true }
  ], data => {
    const name = data.name.trim();
    if (!name) return;
    const id = "proyecto_" + Date.now();
    state.projects[id] = {
      id,
      name,
      activeTab: "main",
      tabs: {
        main: {
          id: "main",
          name: "main",
          type: "main",
          view: { x: 80, y: 90, scale: 1 },
          nodes: [],
          connections: []
        }
      }
    };
    state.currentProjectId = id;
    saveState();
    renderAll();
  });
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

document.getElementById("btnNewFunction").addEventListener("click", () => {
  openFormDialog("Nueva función", [
    { name: "name", label: "Nombre", value: "mi_funcion", required: true },
    { name: "params", label: "Parámetros", value: "a,b", help: "Separados por coma. Ejemplo: a,b,c" },
    { name: "returnValue", label: "Valor devuelto", value: "resultado" }
  ], data => {
    const clean = sanitizeFunctionName(data.name);
    if (!clean) return createToast("Nombre no válido", "La función necesita un nombre.");

    if (getFunctionTab(clean)) {
      return createToast("Función existente", "Ya existe una función con ese nombre.");
    }

    const params = normalizeParams(data.params);
    const returnValue = sanitizeFunctionName(data.returnValue) || "resultado";
    const id = "fn_" + clean + "_" + Date.now();
    const startId = "n" + state.nodeCounter++;
    const returnId = "n" + state.nodeCounter++;

    currentProject().tabs[id] = {
      id,
      name: clean,
      type: "function",
      params: params.join(","),
      returnValue,
      view: { x: 80, y: 90, scale: 1 },
      nodes: [
        { id: startId, kind: "start", title: "Inicio función", data: {}, x: 80, y: 160 },
        { id: returnId, kind: "return", title: "Return", data: { value: params[0] || returnValue }, x: 360, y: 160 }
      ],
      connections: [
        { id: "c" + state.connectionCounter++, type: "flow", from: startId, fromSlot: "flowOut", to: returnId, toSlot: "flowIn" }
      ]
    };

    currentProject().activeTab = id;
    clearSelection();
    saveState();
    renderAll();
  });
});

document.getElementById("btnEditFunction").addEventListener("click", () => {
  const tab = currentTab();

  if (tab.type !== "function") {
    return createToast("No es una función", "Abre primero una pestaña de función.");
  }

  openFormDialog("Editar función actual", [
    { name: "name", label: "Nombre", value: tab.name, required: true },
    { name: "params", label: "Parámetros", value: tab.params || "entrada", help: "Separados por coma." },
    { name: "returnValue", label: "Valor devuelto", value: tab.returnValue || "resultado" }
  ], data => {
    const clean = sanitizeFunctionName(data.name);
    if (!clean) return createToast("Nombre no válido", "La función necesita un nombre.");

    const existing = Object.values(currentProject().tabs).find(other => other.type === "function" && other.name === clean && other.id !== tab.id);
    if (existing) return createToast("Función existente", "Ya existe otra función con ese nombre.");

    const oldName = tab.name;
    tab.name = clean;
    tab.params = normalizeParams(data.params).join(",");
    tab.returnValue = sanitizeFunctionName(data.returnValue) || "resultado";

    updateFunctionCallNames(oldName, clean, tab.returnValue);
    saveState();
    renderAll();
  });
});

function sanitizeFunctionName(value) {
  return String(value || "").trim().replace(/[^\wáéíóúÁÉÍÓÚñÑ]/g, "_").replace(/^(\d)/, "_$1");
}

function normalizeParams(value) {
  const params = String(value || "").split(",").map(item => sanitizeFunctionName(item)).filter(Boolean);
  return params.length ? params : ["entrada"];
}

function updateFunctionCallNames(oldName, newName, returnValue) {
  Object.values(currentProject().tabs).forEach(tab => {
    tab.nodes.forEach(node => {
      if (node.kind === "function_call" && node.data?.functionName === oldName) {
        node.data.functionName = newName;
        node.title = newName;
        node.data.target ||= returnValue;
      }
    });
  });
}

document.getElementById("btnDeleteProject").addEventListener("click", () => {
  const ids = Object.keys(state.projects);
  if (ids.length <= 1) return createToast("No permitido", "Debe existir al menos un proyecto.");
  if (!confirm("¿Eliminar el proyecto actual?")) return;
  delete state.projects[state.currentProjectId];
  state.currentProjectId = Object.keys(state.projects)[0];
  saveState();
  renderAll();
});

document.getElementById("btnExport").addEventListener("click", () => {
  downloadBlob(new Blob([JSON.stringify(currentProject(), null, 2)], { type: "application/json" }), `jocarsa-nodos-${currentProject().id}.json`);
});

document.getElementById("btnPlay").addEventListener("click", runProject);
document.getElementById("btnClearConsole").addEventListener("click", () => {
  consoleOutput.innerHTML = '<span class="console-empty">Consola limpia.</span>';
});

function runProject() {
  const project = currentProject();
  const previous = project.activeTab;
  project.activeTab = "main";
  const start = currentTab().nodes.find(node => node.kind === "start");
  const env = {};
  const output = [];

  try {
    if (!start) throw new Error("No hay nodo Inicio en main.");
    executeFlowFrom(start.id, "flowOut", env, output);
    consoleOutput.textContent = output.length ? output.join("\n") : "(sin salida)";
  } catch (error) {
    consoleOutput.textContent = "ERROR: " + error.message;
  } finally {
    project.activeTab = previous;
    renderWorkspace();
  }
}

function executeFlowFrom(nodeId, outSlot, env, output) {
  if (env.__stop) return;
  const conn = getFlowConnection(nodeId, outSlot);
  if (!conn) return;
  executeNode(conn.to, env, output);
}

function executeNode(nodeId, env, output) {
  const node = getNode(nodeId);
  if (!node) return;
  const d = node.data || {};

  if (node.kind === "assign") {
    env[d.name] = evalDataInput(node.id, "value", d.value, env);
    executeFlowFrom(node.id, "flowOut", env, output);
  } else if (node.kind === "print") {
    output.push(String(evalDataInput(node.id, "value", d.value, env)));
    executeFlowFrom(node.id, "flowOut", env, output);
  } else if (node.kind === "if") {
    executeFlowFrom(node.id, Boolean(evalDataInput(node.id, "condition", d.condition, env)) ? "true" : "false", env, output);
  } else if (node.kind === "for") {
    const iterator = d.iterator || "i";
    const from = Number(evalExpression(d.from ?? "0", env));
    const to = Number(evalExpression(d.to ?? "10", env));
    const step = Number(evalExpression(d.step ?? "1", env));
    if (step === 0) throw new Error("El paso del FOR no puede ser 0.");
    for (let i = from; step > 0 ? i <= to : i >= to; i += step) {
      env[iterator] = i;
      executeFlowFrom(node.id, "body", env, output);
      if (env.__stop) break;
    }
    executeFlowFrom(node.id, "exit", env, output);
  } else if (node.kind === "list_push") {
    const list = evalDataInput(node.id, "list", d.list, env);
    const value = evalDataInput(node.id, "value", d.value, env);
    if (!Array.isArray(list)) throw new Error("list_push necesita una lista.");
    list.push(value);
    executeFlowFrom(node.id, "flowOut", env, output);
  } else if (node.kind === "list_length") {
    const value = evalDataOutput(node.id, "out", env);
    if (d.target) env[d.target] = value;
    executeFlowFrom(node.id, "flowOut", env, output);
  } else if (node.kind === "function_call") {
    const value = executeFunctionCall(node, env, output);
    if (d.target) env[d.target] = value;
    executeFlowFrom(node.id, "flowOut", env, output);
  } else if (node.kind === "return") {
    env.__return = evalDataInput(node.id, "value", d.value, env);
    env.__stop = true;
  }
}

function evalDataInput(nodeId, slotId, fallback, env) {
  const conn = currentTab().connections.find(c => c.type === "data" && c.to === nodeId && c.toSlot === slotId);
  if (!conn) return evalExpression(fallback, env);
  return evalDataOutput(conn.from, conn.fromSlot, env);
}

function evalDataOutput(nodeId, slotId, env) {
  const node = getNode(nodeId);
  if (!node) return undefined;
  const d = node.data || {};

  if (node.kind === "start" && currentTab().type === "function" && slotId.startsWith("param")) {
    const index = Number(slotId.replace("param", ""));
    const param = getFunctionParams(currentTab())[index];
    return env[param];
  }

  if (node.kind === "declare") {
    const value = evalExpression(d.value, env);
    env[d.name] = value;
    return value;
  }

  if (node.kind === "operation") {
    const left = evalDataInput(node.id, "left", d.left, env);
    const right = evalDataInput(node.id, "right", d.right, env);
    const value = applyOperator(left, d.operator, right);
    if (d.target) env[d.target] = value;
    return value;
  }

  if (node.kind === "comparison" || node.kind === "boolean") {
    return Boolean(applyOperator(
      evalDataInput(node.id, "left", d.left, env),
      d.operator,
      evalDataInput(node.id, "right", d.right, env)
    ));
  }

  if (node.kind === "list") {
    const values = String(d.values ?? "").split(",").filter(v => v.trim() !== "").map(v => evalExpression(v.trim(), env));
    env[d.name] = values;
    return values;
  }

  if (node.kind === "list_get") {
    const list = evalDataInput(node.id, "list", d.list, env);
    const index = Number(evalDataInput(node.id, "index", d.index, env));
    const value = Array.isArray(list) ? list[index] : undefined;
    if (d.target) env[d.target] = value;
    return value;
  }

  if (node.kind === "list_length") {
    const list = evalDataInput(node.id, "list", d.list, env);
    const value = Array.isArray(list) ? list.length : 0;
    if (d.target) env[d.target] = value;
    return value;
  }

  if (node.kind === "function_call") {
    return executeFunctionCall(node, env, []);
  }

  if (node.kind === "for" && slotId === "iter") {
    return env[d.iterator || "i"];
  }

  if (node.kind === "assign") {
    return env[d.name];
  }

  return undefined;
}

function executeFunctionCall(node, env, output) {
  const project = currentProject();
  const d = node.data || {};
  const fnTab = getFunctionTab(d.functionName);
  if (!fnTab) throw new Error("Función no encontrada: " + d.functionName);

  const previousTab = project.activeTab;
  const localEnv = { ...env };
  const params = getFunctionParams(fnTab);

  params.forEach((param, index) => {
    localEnv[param] = evalDataInput(node.id, "arg" + index, d["arg" + index], env);
  });

  project.activeTab = fnTab.id;
  const start = currentTab().nodes.find(n => n.kind === "start");
  if (start) executeFlowFrom(start.id, "flowOut", localEnv, output);
  project.activeTab = previousTab;

  return localEnv.__return;
}

function getFlowConnection(nodeId, fromSlot) {
  return currentTab().connections.find(c => c.type === "flow" && c.from === nodeId && c.fromSlot === fromSlot);
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
    case "and":
    case "&&": return Boolean(left) && Boolean(right);
    case "or":
    case "||": return Boolean(left) || Boolean(right);
    default: throw new Error("Operador no soportado: " + operator);
  }
}

function evalExpression(expr, env) {
  if (expr === undefined || expr === null) return null;
  if (typeof expr !== "string") return expr;
  const value = expr.trim();
  if (value === "") return "";
  if (/^[a-zA-Z_$][\w$]*$/.test(value) && Object.prototype.hasOwnProperty.call(env, value)) return env[value];
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  try {
    const names = Object.keys(env);
    const values = Object.values(env);
    return Function(...names, `"use strict"; return (${value});`)(...values);
  } catch {
    return value;
  }
}

document.getElementById("btnPseudo").addEventListener("click", () => showCode("pseudo"));
document.getElementById("btnPython").addEventListener("click", () => showCode("python"));
document.getElementById("btnJavaScript").addEventListener("click", () => showCode("javascript"));
document.getElementById("btnC").addEventListener("click", () => showCode("c"));
document.getElementById("btnCpp").addEventListener("click", () => showCode("cpp"));

function showCode(language) {
  state.lastLanguage = language;
  const code = compileProject(language);
  const titles = { pseudo: "Pseudocódigo", python: "Código Python", javascript: "Código JavaScript", c: "Código C", cpp: "Código C++" };
  document.getElementById("codeDialogTitle").textContent = titles[language];
  document.getElementById("codeOutput").textContent = code;
  document.getElementById("codeDialog").showModal();
}

function compileProject(language) {
  const compiler = compilers[language];

  if (!compiler) {
    return `// Compilador no disponible para: ${language}`;
  }

  const project = currentProject();
  const chunks = [];

  Object.values(project.tabs).filter(tab => tab.type === "function").forEach(tab => {
    chunks.push(compileTab(tab, compiler, true));
  });

  let mainCode = compileTab(project.tabs.main, compiler, false);
  if (compiler.mainEnd) mainCode += "\n" + compiler.mainEnd();
  chunks.push(mainCode);
  return chunks.join("\n\n");
}

function compileTab(tab, c, isFunction) {
  const project = currentProject();
  const previous = project.activeTab;
  project.activeTab = tab.id;

  const lines = [];
  const ctx = { c, lines, indent: 0, declared: new Set() };

  if (isFunction) {
    const params = getFunctionParams(tab).join(", ");
    lines.push(c.functionStart(tab.name, params));
    ctx.indent++;
  } else {
    lines.push(...c.header(currentProject()));
  }

  const start = tab.nodes.find(n => n.kind === "start");
  if (start) compileFlowFrom(start.id, "flowOut", ctx);

  if (isFunction) {
    ctx.indent--;
    if (c.blockEndFunction) lines.push(c.line(ctx.indent, c.blockEndFunction()));
  }

  project.activeTab = previous;
  return lines.filter(line => line !== "").join("\n");
}

function compileFlowFrom(nodeId, outSlot, ctx) {
  const conn = getFlowConnection(nodeId, outSlot);
  if (!conn) return;
  compileNodeFlow(conn.to, ctx);
}

function compileNodeFlow(nodeId, ctx) {
  const node = getNode(nodeId);
  if (!node) return;
  const d = node.data || {};
  const c = ctx.c;

  if (node.kind === "print") {
    ctx.lines.push(c.line(ctx.indent, c.print(compileDataInput(node.id, "value", d.value, ctx))));
    compileFlowFrom(node.id, "flowOut", ctx);
  } else if (node.kind === "assign") {
    ctx.lines.push(c.line(ctx.indent, c.assign(d.name, compileDataInput(node.id, "value", d.value, ctx))));
    compileFlowFrom(node.id, "flowOut", ctx);
  } else if (node.kind === "if") {
    ctx.lines.push(c.line(ctx.indent, c.ifStart(compileDataInput(node.id, "condition", d.condition, ctx))));
    ctx.indent++;
    compileFlowFrom(node.id, "true", ctx);
    ctx.indent--;
    ctx.lines.push(c.line(ctx.indent, c.elseStart()));
    ctx.indent++;
    compileFlowFrom(node.id, "false", ctx);
    ctx.indent--;
    ctx.lines.push(c.line(ctx.indent, c.blockEnd("if")));
  } else if (node.kind === "for") {
    ctx.lines.push(c.line(ctx.indent, c.forStart(d.iterator || "i", d.from ?? "0", d.to ?? "10", d.step ?? "1")));
    ctx.indent++;
    compileFlowFrom(node.id, "body", ctx);
    ctx.indent--;
    ctx.lines.push(c.line(ctx.indent, c.blockEnd("for")));
    compileFlowFrom(node.id, "exit", ctx);
  } else if (node.kind === "list_push") {
    ctx.lines.push(c.line(ctx.indent, c.listPush(compileDataInput(node.id, "list", d.list, ctx), compileDataInput(node.id, "value", d.value, ctx))));
    compileFlowFrom(node.id, "flowOut", ctx);
  } else if (node.kind === "list_length") {
    ctx.lines.push(c.line(ctx.indent, c.assign(d.target || "longitud", c.listLength(compileDataInput(node.id, "list", d.list, ctx)))));
    compileFlowFrom(node.id, "flowOut", ctx);
  } else if (node.kind === "function_call") {
    const args = compileFunctionArgs(node, ctx);
    ctx.lines.push(c.line(ctx.indent, c.assign(d.target || "resultado", c.call(d.functionName, args))));
    compileFlowFrom(node.id, "flowOut", ctx);
  } else if (node.kind === "return") {
    ctx.lines.push(c.line(ctx.indent, c.returnLine(compileDataInput(node.id, "value", d.value, ctx))));
  }
}

function compileDataInput(nodeId, slotId, fallback, ctx) {
  const conn = currentTab().connections.find(c => c.type === "data" && c.to === nodeId && c.toSlot === slotId);
  if (!conn) return ctx.c.expr(fallback);
  return compileDataOutput(conn.from, conn.fromSlot, ctx);
}

function compileDataOutput(nodeId, slotId, ctx) {
  const node = getNode(nodeId);
  const d = node.data || {};
  const c = ctx.c;

  if (node.kind === "start" && currentTab().type === "function" && slotId.startsWith("param")) {
    const index = Number(slotId.replace("param", ""));
    return getFunctionParams(currentTab())[index] || "undefined";
  }

  if (node.kind === "declare") {
    const target = d.name || `var_${node.id}`;
    if (!ctx.declared.has(node.id)) {
      ctx.lines.push(c.line(ctx.indent, c.declare(target, c.expr(d.value))));
      ctx.declared.add(node.id);
    }
    return target;
  }

  if (node.kind === "operation") {
    const target = d.target || `tmp_${node.id}`;
    if (!ctx.declared.has(node.id)) {
      ctx.lines.push(c.line(ctx.indent, c.assign(target, c.binary(compileDataInput(node.id, "left", d.left, ctx), d.operator || "+", compileDataInput(node.id, "right", d.right, ctx)))));
      ctx.declared.add(node.id);
    }
    return target;
  }

  if (node.kind === "comparison" || node.kind === "boolean") {
    const target = `cond_${node.id}`;
    if (!ctx.declared.has(node.id)) {
      ctx.lines.push(c.line(ctx.indent, c.assign(target, c.binary(compileDataInput(node.id, "left", d.left, ctx), d.operator || ">", compileDataInput(node.id, "right", d.right, ctx)))));
      ctx.declared.add(node.id);
    }
    return target;
  }

  if (node.kind === "list") {
    const target = d.name || `list_${node.id}`;
    if (!ctx.declared.has(node.id)) {
      ctx.lines.push(c.line(ctx.indent, c.declare(target, c.listLiteral(d.values || ""))));
      ctx.declared.add(node.id);
    }
    return target;
  }

  if (node.kind === "list_get") {
    const target = d.target || `item_${node.id}`;
    if (!ctx.declared.has(node.id)) {
      ctx.lines.push(c.line(ctx.indent, c.assign(target, c.listGet(compileDataInput(node.id, "list", d.list, ctx), compileDataInput(node.id, "index", d.index, ctx)))));
      ctx.declared.add(node.id);
    }
    return target;
  }

  if (node.kind === "list_length") {
    const target = d.target || `len_${node.id}`;
    if (!ctx.declared.has(node.id)) {
      ctx.lines.push(c.line(ctx.indent, c.assign(target, c.listLength(compileDataInput(node.id, "list", d.list, ctx)))));
      ctx.declared.add(node.id);
    }
    return target;
  }

  if (node.kind === "function_call") {
    const target = d.target || `ret_${node.id}`;
    if (!ctx.declared.has(node.id)) {
      ctx.lines.push(c.line(ctx.indent, c.assign(target, c.call(d.functionName, compileFunctionArgs(node, ctx)))));
      ctx.declared.add(node.id);
    }
    return target;
  }

  if (node.kind === "for" && slotId === "iter") return d.iterator || "i";
  if (node.kind === "assign") return d.name;
  return "undefined";
}

function compileFunctionArgs(node, ctx) {
  const fn = getFunctionTab(node.data?.functionName);
  const params = getFunctionParams(fn);
  return params.map((param, index) => {
    return compileDataInput(node.id, "arg" + index, node.data?.["arg" + index] ?? param, ctx);
  }).join(", ");
}

const compilers = {
  pseudo: {
    header: p => [`PROYECTO ${p.name}`, ""],
    line: (i, text) => "    ".repeat(i) + text,
    expr: v => String(v ?? ""),
    binary: (a, op, b) => `${a} ${op} ${b}`,
    declare: (n, v) => `crear ${n} = ${v}`,
    assign: (n, v) => `${n} = ${v}`,
    print: v => `mostrar ${v}`,
    ifStart: c => `si ${c} entonces`,
    elseStart: () => `si no`,
    forStart: (i, f, t, s) => `para ${i} desde ${f} hasta ${t} paso ${s}`,
    blockEnd: type => type === "if" ? "fin si" : "fin para",
    functionStart: (n, p) => `función ${n}(${p})`,
    blockEndFunction: () => `fin función`,
    returnLine: v => `devolver ${v}`,
    listPush: (l, v) => `añadir ${v} a ${l}`,
    listLength: l => `longitud(${l})`,
    listGet: (l, i) => `${l}[${i}]`,
    listLiteral: values => `[${values}]`,
    call: (n, a) => `${n}(${a})`
  },

  python: {
    header: p => [`# ${p.name}`, "# Generado por jocarsa | nodos", ""],
    line: (i, text) => "    ".repeat(i) + text,
    expr: v => pyExpr(v),
    binary: (a, op, b) => `${a} ${op === "===" ? "==" : op === "!==" ? "!=" : op === "&&" ? "and" : op === "||" ? "or" : op} ${b}`,
    declare: (n, v) => `${n} = ${v}`,
    assign: (n, v) => `${n} = ${v}`,
    print: v => `print(${v})`,
    ifStart: c => `if ${c}:`,
    elseStart: () => `else:`,
    forStart: (i, f, t, s) => `for ${i} in range(${f}, ${Number(t) + 1}, ${s}):`,
    blockEnd: () => ``,
    functionStart: (n, p) => `def ${n}(${p}):`,
    returnLine: v => `return ${v}`,
    listPush: (l, v) => `${l}.append(${v})`,
    listLength: l => `len(${l})`,
    listGet: (l, i) => `${l}[${i}]`,
    listLiteral: values => `[${values}]`,
    call: (n, a) => `${n}(${a})`
  },

  javascript: {
    header: p => [`// ${p.name}`, "// Generado por jocarsa | nodos", ""],
    line: (i, text) => "  ".repeat(i) + text,
    expr: v => jsExpr(v),
    binary: (a, op, b) => `${a} ${op === "and" ? "&&" : op === "or" ? "||" : op} ${b}`,
    declare: (n, v) => `let ${n} = ${v};`,
    assign: (n, v) => `${n} = ${v};`,
    print: v => `console.log(${v});`,
    ifStart: c => `if (${c}) {`,
    elseStart: () => `} else {`,
    forStart: (i, f, t, s) => `for (let ${i} = ${f}; ${i} <= ${t}; ${i} += ${s}) {`,
    blockEnd: () => `}`,
    functionStart: (n, p) => `function ${n}(${p}) {`,
    blockEndFunction: () => `}`,
    returnLine: v => `return ${v};`,
    listPush: (l, v) => `${l}.push(${v});`,
    listLength: l => `${l}.length`,
    listGet: (l, i) => `${l}[${i}]`,
    listLiteral: values => `[${values}]`,
    call: (n, a) => `${n}(${a})`
  },

  c: {
    header: p => [`#include <stdio.h>`, `#include <stdbool.h>`, ``, `// ${p.name}`, ``, `int main(void) {`],
    line: (i, text) => "    ".repeat(i + 1) + text,
    expr: v => cExpr(v),
    binary: (a, op, b) => `${a} ${cOperator(op)} ${b}`,
    declare: (n, v) => `int ${n} = ${v};`,
    assign: (n, v) => `${n} = ${v};`,
    print: v => `printf("%d\\n", ${v});`,
    ifStart: c => `if (${c}) {`,
    elseStart: () => `} else {`,
    forStart: (i, f, t, s) => `for (int ${i} = ${f}; ${i} <= ${t}; ${i} += ${s}) {`,
    blockEnd: () => `}`,
    functionStart: (n, p) => `int ${n}(${cParams(p)}) {`,
    blockEndFunction: () => `}`,
    returnLine: v => `return ${v};`,
    listPush: (l, v) => `/* añadir ${v} a ${l}: pendiente de vector dinámico */`,
    listLength: l => `${l}_len`,
    listGet: (l, i) => `${l}[${i}]`,
    listLiteral: values => `{${values}}`,
    call: (n, a) => `${n}(${a})`,
    mainEnd: () => `    return 0;\n}`
  },

  cpp: {
    header: p => [`#include <iostream>`, `#include <vector>`, `using namespace std;`, ``, `// ${p.name}`, ``, `int main() {`],
    line: (i, text) => "    ".repeat(i + 1) + text,
    expr: v => cExpr(v),
    binary: (a, op, b) => `${a} ${cOperator(op)} ${b}`,
    declare: (n, v) => `auto ${n} = ${v};`,
    assign: (n, v) => `${n} = ${v};`,
    print: v => `cout << ${v} << endl;`,
    ifStart: c => `if (${c}) {`,
    elseStart: () => `} else {`,
    forStart: (i, f, t, s) => `for (int ${i} = ${f}; ${i} <= ${t}; ${i} += ${s}) {`,
    blockEnd: () => `}`,
    functionStart: (n, p) => `auto ${n}(${cppParams(p)}) {`,
    blockEndFunction: () => `}`,
    returnLine: v => `return ${v};`,
    listPush: (l, v) => `${l}.push_back(${v});`,
    listLength: l => `${l}.size()`,
    listGet: (l, i) => `${l}[${i}]`,
    listLiteral: values => `vector<int>{${values}}`,
    call: (n, a) => `${n}(${a})`,
    mainEnd: () => `    return 0;\n}`
  }
};

function pyExpr(v) {
  if (v === undefined || v === null) return "None";
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return s;
  if (s === "true") return "True";
  if (s === "false") return "False";
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s;
  if (/^[a-zA-Z_$][\w$]*$/.test(s)) return s;
  return JSON.stringify(s);
}

function jsExpr(v) {
  if (v === undefined || v === null) return "null";
  const s = String(v).trim();
  if (/^-?\d+(\.\d)?$/.test(s)) return s;
  if (s === "true" || s === "false" || s === "null") return s;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s;
  if (/^[a-zA-Z_$][\w$]*$/.test(s)) return s;
  return JSON.stringify(s);
}


function cExpr(v) {
  if (v === undefined || v === null) return "0";
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return s;
  if (s === "true") return "true";
  if (s === "false") return "false";
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s;
  if (/^[a-zA-Z_$][\w$]*$/.test(s)) return s;
  return "0";
}

function cOperator(op) {
  if (op === "and") return "&&";
  if (op === "or") return "||";
  if (op === "===") return "==";
  if (op === "!==") return "!=";
  return op;
}

function cParams(params) {
  if (!params || !params.trim()) return "void";
  return params.split(",").map(p => "int " + p.trim()).join(", ");
}

function cppParams(params) {
  if (!params || !params.trim()) return "";
  return params.split(",").map(p => "auto " + p.trim()).join(", ");
}

document.getElementById("btnCloseDialog").addEventListener("click", () => document.getElementById("codeDialog").close());
document.getElementById("btnCopyCode").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.getElementById("codeOutput").textContent);
  createToast("Código copiado", "Copiado al portapapeles.");
});
document.getElementById("btnDownloadCode").addEventListener("click", () => {
  const ext = state.lastLanguage === "python" ? "py"
    : state.lastLanguage === "javascript" ? "js"
    : state.lastLanguage === "c" ? "c"
    : state.lastLanguage === "cpp" ? "cpp"
    : "txt";
  downloadBlob(new Blob([document.getElementById("codeOutput").textContent], { type: "text/plain" }), `${currentProject().id}.${ext}`);
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
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

  if (state.selectedNodeId) {
    currentTab().nodes = currentTab().nodes.filter(node => node.id !== state.selectedNodeId);
    currentTab().connections = currentTab().connections.filter(conn => conn.from !== state.selectedNodeId && conn.to !== state.selectedNodeId);
    clearSelection();
    saveState();
    renderAll();
    return;
  }

  if (state.selectedConnectionId) {
    currentTab().connections = currentTab().connections.filter(conn => conn.id !== state.selectedConnectionId);
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
    if (project && count) count.textContent = countProjectNodes(project);
  });
}

function createToast(title, text) {
  const stack = document.getElementById("toastStack");
  const toast = document.createElement("article");
  toast.className = "ju-toast chaflan";
  toast.innerHTML = `<div class="ju-toast-icon chaflan">i</div><div><p class="ju-toast-title">${title}</p><p class="ju-toast-text">${text}</p></div><button class="ju-toast-close" type="button">×</button>`;
  const close = () => toast.remove();
  toast.querySelector(".ju-toast-close").addEventListener("click", close);
  stack.appendChild(toast);
  setTimeout(close, 4200);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

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
createToast("jocarsa | nodos", "Prototipo v19 cargado.");
