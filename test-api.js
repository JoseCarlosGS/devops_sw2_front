// Script de prueba para verificar la conexión con el backend
async function testAPI() {
    try {
        console.log('🔍 Probando conexión con el backend...');
        
        // Probar GET /projects
        const response = await fetch('http://localhost:5173/api/projects');
        console.log('📡 Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Conexión exitosa!');
            console.log('📋 Proyectos encontrados:', data.length || 0);
            console.log('📄 Datos:', data);
        } else {
            console.log('❌ Error en la respuesta:', response.statusText);
        }
        
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
        console.log('💡 Asegúrate de que el backend esté corriendo en http://localhost:5173');
    }
}

// Probar POST /projects
async function testCreateProject() {
    try {
        console.log('🔍 Probando creación de proyecto...');
        
        const testProject = {
            projectName: "Proyecto de Prueba",
            clientName: "Cliente Test",
            description: "Descripción de prueba para verificar la API"
        };
        
        const response = await fetch('http://localhost:5173/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testProject)
        });
        
        console.log('📡 Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Proyecto creado exitosamente!');
            console.log('📄 Respuesta:', data);
        } else {
            console.log('❌ Error al crear proyecto:', response.statusText);
        }
        
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
    }
}

// Ejecutar pruebas
testAPI();