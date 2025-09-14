const sources = ['Website', 'LinkedIn', 'Email Campaign', 'Cold Call', 'Referral', 'Trade Show', 'Social Media', 'Advertisement'];
const statuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'];

const firstNames = [
    'Ana', 'Carlos', 'Maria', 'Roberto', 'Sofia', 'James', 'Priya', 'Michael', 'Emma', 'David',
    'Sarah', 'Zhang', 'Isabella', 'Ahmed', 'Nicole', 'Lucas', 'Fatima', 'Kevin', 'Aisha', 'Ryan',
    'Camila', 'Hassan', 'Emily', 'Omar', 'Lucia', 'Alexander', 'Zara', 'Daniel', 'Layla', 'Nathan',
    'Valentina', 'Yuki', 'Grace', 'Raj', 'Chloe', 'Mohamed', 'Sophia', 'Ethan', 'Amara', 'Leo',
    'Maya', 'Jin', 'Olivia', 'Arjun', 'Zoe', 'Ali', 'Luna', 'Noah', 'Aya', 'Mason'
];

const lastNames = [
    'Silva', 'Mendoza', 'Santos', 'Lima', 'Rodriguez', 'Chen', 'Patel', 'Thompson', 'Wilson', 'Kim',
    'Johnson', 'Wei', 'Martinez', 'Hassan', 'Brown', 'Garcia', 'Ahmed', 'Davis', 'Miller', 'Jones',
    'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Clark', 'Lewis', 'Walker',
    'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams',
    'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker'
];

const companies = [
    'TechFlow Systems', 'DataStream Corp', 'CloudNine Solutions', 'InnovateLab', 'NextGen Technologies',
    'Digital Dynamics', 'SmartLogic Inc', 'FutureWorks', 'Quantum Analytics', 'ByteForge',
    'CyberCore Systems', 'Velocity Ventures', 'Pinnacle Tech', 'Synergy Solutions', 'Apex Industries',
    'Prime Digital', 'Elite Enterprises', 'Vision Systems', 'Spark Technologies', 'Nexus Corp',
    'Global Dynamics', 'Infinite Solutions', 'Stellar Systems', 'Fusion Technologies', 'Vertex Corp',
    'Catalyst Consulting', 'Momentum Labs', 'Zenith Technologies', 'Phoenix Systems', 'Horizon Corp',
    'Breakthrough Tech', 'Elevate Solutions', 'Unity Systems', 'Triumph Technologies', 'Summit Corp',
    'Vanguard Systems', 'Pioneer Technologies', 'Legacy Solutions', 'Prestige Corp', 'Enterprise Hub',
    'Metropolitan Systems', 'Continental Tech', 'Universal Solutions', 'Pacific Technologies', 'Atlantic Corp'
];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateLeads(count) {
    const leads = [];
    const startDate = new Date('2025-07-01');
    const endDate = new Date('2025-09-13');

    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const createdAt = randomDate(startDate, endDate);
        const updatedAt = new Date(createdAt.getTime() + Math.random() * (endDate.getTime() - createdAt.getTime()));

        leads.push({
            id: `lead_${String(i).padStart(3, '0')}`,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
            company: company,
            source: sources[Math.floor(Math.random() * sources.length)],
            score: Math.floor(Math.random() * 100) + 1,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString()
        });
    }

    return leads;
}

// Generate 200 leads
const leads = generateLeads(200);

// Only output to console if run directly (not imported)
if (require.main === module) {
    console.log(JSON.stringify(leads, null, 2));
}