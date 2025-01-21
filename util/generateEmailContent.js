const generateEmailContent = (searchQuery, resultsHtml) => {
    const emailSubject  = 'Top 5 Bing Search Results';
    const htmlBody = `<h3>Top 5 Bing Search Results for "${searchQuery}"</h3>${resultsHtml}`;

    return { emailSubject, htmlBody };
};

module.exports = generateEmailContent;