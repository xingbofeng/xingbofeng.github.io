const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_OWNER = 'xingbofeng';
const REPO_NAME = 'xingbofeng.github.io';
const README_PATH = path.join(__dirname, '../README.md');

function fetchIssues() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&per_page=100`,
            headers: {
                'User-Agent': 'Node.js Script'
            }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const issues = JSON.parse(data);
                    if (res.statusCode !== 200) {
                        reject(new Error(`GitHub API Error: ${issues.message}`));
                    } else {
                        resolve(issues);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (e) => reject(e));
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

async function updateReadme() {
    try {
        console.log('Fetching issues...');
        const issues = await fetchIssues();
        
        // Filter out Pull Requests
        const blogPosts = issues.filter(issue => !issue.pull_request);
        
        console.log(`Found ${blogPosts.length} blog posts.`);

        let newContent = '';
        blogPosts.forEach(post => {
            const date = formatDate(post.created_at);
            // Link to the blog SPA with hash
            const url = `https://${REPO_OWNER}.github.io/#issue-${post.number}`;
            newContent += `- \`${date}\` [${post.title}](${url})\n`;
        });

        const readmeContent = fs.readFileSync(README_PATH, 'utf8');
        
        const startMarker = '<!-- BLOG-POST-LIST:START -->';
        const endMarker = '<!-- BLOG-POST-LIST:END -->';
        
        const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
        
        if (!readmeContent.match(regex)) {
            console.log('Markers not found in README.md. Appending to the end.');
            const appendContent = `\n\n## 📝 文章列表\n\n${startMarker}\n${newContent}${endMarker}\n`;
            fs.writeFileSync(README_PATH, readmeContent + appendContent);
        } else {
            const updatedReadme = readmeContent.replace(regex, `${startMarker}\n${newContent}${endMarker}`);
            fs.writeFileSync(README_PATH, updatedReadme);
        }
        
        console.log('README.md updated successfully!');

    } catch (error) {
        console.error('Error updating README:', error.message);
        process.exit(1);
    }
}

updateReadme();
