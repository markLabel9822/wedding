const { createClient } = require('@supabase/supabase-js');

/**
 * Vercel Serverless Function for GET Blessings
 * Environment variables needed:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_ANON_KEY: Your Supabase anonymous key
 */

module.exports = async function handler(req, res) {
	// Only allow GET requests
	if (req.method !== 'GET') {
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

	const limit = parseInt(req.query.limit) || 100;
	const offset = parseInt(req.query.offset) || 0;
	const orderBy = req.query.orderBy || 'submitted_at';
	const order = 'desc'; 

	// Fetch blessings from Supabase
	const { data, error, count } = await supabase
		.from('blessings')
		.select('id, name, message, text_color, background_color, submitted_at', { count: 'exact' })
		.order(orderBy, { ascending: false }) // ascending: false = descending
		.range(offset, offset + limit - 1);

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
			data: data || [],
			count: count || 0,
			limit: limit,
			offset: offset
		});

	} catch (error) {
		console.error('Unexpected error:', error);
		return res.status(500).json({ 
			error: 'Internal server error',
			message: error.message 
		});
	}
}

