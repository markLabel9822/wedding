const { createClient } = require('@supabase/supabase-js');

/**
 * Vercel Serverless Function for Blessing submission
 * Environment variables needed:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_ANON_KEY: Your Supabase anonymous key
 */

module.exports = async function handler(req, res) {
	// Only allow POST requests
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	// Check if Supabase credentials are configured
	if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
		console.error('Missing Supabase environment variables');
		return res.status(500).json({ 
			error: 'Server configuration error',
			message: 'Supabase credentials not configured'
		});
	}

	// Trim whitespace from environment variables
	const supabaseUrl = process.env.SUPABASE_URL.trim();
	const supabaseKey = process.env.SUPABASE_ANON_KEY.trim();

	// Validate URL format
	if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
		console.error('Invalid SUPABASE_URL format:', supabaseUrl);
		return res.status(500).json({ 
			error: 'Server configuration error',
			message: 'SUPABASE_URL must be a valid HTTP or HTTPS URL'
		});
	}

	try {
		// Initialize Supabase client
		const supabase = createClient(supabaseUrl, supabaseKey);

		// Get form data from request body
		const { name, message, textColor, backgroundColor } = req.body;

		// Validate required fields
		if (!name || !message) {
			return res.status(400).json({ 
				error: 'Validation error',
				message: 'Name and message are required'
			});
		}

		// Validate name length
		if (name.trim().length < 2) {
			return res.status(400).json({ 
				error: 'Validation error',
				message: 'Name must be at least 2 characters'
			});
		}

		// Validate message length
		if (message.trim().length < 5) {
			return res.status(400).json({ 
				error: 'Validation error',
				message: 'Message must be at least 5 characters'
			});
		}

		// Prepare data for database
		const blessingData = {
			name: name.trim(),
			message: message.trim(),
			text_color: textColor || '#ffffff',
			background_color: backgroundColor || '#ffd1dc',
			submitted_at: new Date().toISOString()
		};

		// Insert into Supabase (table name: 'blessings')
		// Make sure your Supabase table is named 'blessings' or update this
		const { data, error } = await supabase
			.from('blessings')
			.insert([blessingData])
			.select();

		if (error) {
			console.error('Supabase error:', error);
			return res.status(500).json({ 
				error: 'Database error',
				message: error.message 
			});
		}

		// Success response
		return res.status(200).json({ 
			success: true,
			message: 'Blessing submitted successfully',
			data: data[0]
		});

	} catch (error) {
		console.error('Unexpected error:', error);
		return res.status(500).json({ 
			error: 'Internal server error',
			message: error.message 
		});
	}
}

