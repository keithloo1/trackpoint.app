const fs = require('fs');

function fixGrids(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');

    code = code.split('<div className="grid grid-cols-3 gap-5 mb-8">').join('<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">');
    code = code.split('<div className="grid grid-cols-3 gap-8">').join('<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">');
    code = code.split('<div className="grid grid-cols-2 gap-6">').join('<div className="grid grid-cols-1 md:grid-cols-2 gap-6">');
    code = code.split('<div className="grid grid-cols-2 gap-4">').join('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">');
    code = code.split('<div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100">').join('<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">');
    code = code.split('<div className="grid grid-cols-4 gap-6">').join('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">');

    fs.writeFileSync(filePath, code);
}

fixGrids('c:/Users/looch/Downloads/TrackPoint.APP Code/app/frontend/src/pages/DashboardPage.jsx');
fixGrids('c:/Users/looch/Downloads/TrackPoint.APP Code/app/frontend/src/pages/ClientDashboard.jsx');
