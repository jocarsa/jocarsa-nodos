<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$dbPath = __DIR__ . '/nodos.sqlite';

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_key TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            json TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $action = $_GET['action'] ?? 'list';

    if ($action === 'list') {
        $stmt = $pdo->query("SELECT project_key, name, json, created_at, updated_at FROM projects ORDER BY updated_at DESC, id DESC");
        echo json_encode([
            'ok' => true,
            'projects' => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = $_POST;
    }

    if ($action === 'save') {
        $projectKey = trim((string)($input['project_key'] ?? ''));
        $name = trim((string)($input['name'] ?? $projectKey));
        $jsonValue = $input['json'] ?? null;

        if ($projectKey === '') {
            throw new RuntimeException('project_key vacío');
        }

        if (!is_string($jsonValue)) {
            $jsonValue = json_encode($jsonValue, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        if ($jsonValue === false || $jsonValue === null || $jsonValue === '') {
            throw new RuntimeException('json vacío o inválido');
        }

        $stmt = $pdo->prepare("
            INSERT INTO projects(project_key, name, json, created_at, updated_at)
            VALUES(:project_key, :name, :json, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(project_key) DO UPDATE SET
                name = excluded.name,
                json = excluded.json,
                updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([
            ':project_key' => $projectKey,
            ':name' => $name,
            ':json' => $jsonValue
        ]);

        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete') {
        $projectKey = trim((string)($input['project_key'] ?? ''));

        if ($projectKey === '') {
            throw new RuntimeException('project_key vacío');
        }

        $stmt = $pdo->prepare("DELETE FROM projects WHERE project_key = :project_key");
        $stmt->execute([':project_key' => $projectKey]);

        echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'get') {
        $projectKey = trim((string)($_GET['project_key'] ?? ''));

        if ($projectKey === '') {
            throw new RuntimeException('project_key vacío');
        }

        $stmt = $pdo->prepare("SELECT project_key, name, json, created_at, updated_at FROM projects WHERE project_key = :project_key");
        $stmt->execute([':project_key' => $projectKey]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'ok' => true,
            'project' => $project ?: null
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    throw new RuntimeException('Acción no soportada');

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
