        document.addEventListener('DOMContentLoaded', function() {
            const frontPage = document.getElementById('front-page');
            const chatContainer = document.getElementById('chat-container');
            const aboutContainer = document.getElementById('about-container');
            const aboutBtn = document.getElementById('about-btn');
            const chatBtn = document.getElementById('chat-btn');
            const backBtn = document.getElementById('back-btn');
            const backToFrontBtn = document.getElementById('back-to-front-btn');
            
            const chatMessages = document.getElementById('chat-messages');
            const userInput = document.getElementById('user-input');
            const sendButton = document.getElementById('send-button');
            const quickQuestions = document.getElementById('quick-questions');
            const registerButton = document.getElementById('register-button');
            const selarLink = "https://selar.com/tmsomadmforms";
            const historyBtn = document.getElementById('history-btn');
            const historyPanel = document.getElementById('history-panel');
            const closeHistory = document.getElementById('close-history');
            const historyList = document.getElementById('history-list');
            const clearHistoryBtn = document.getElementById('clear-history');
            
            // Initialize chat history from localStorage
            let chatHistory = JSON.parse(localStorage.getItem('tmsomChatHistory')) || [];
            
            // Detailed knowledge base from the provided information
            const knowledgeBase = [
                {
                    questionTerms: ["what is tmsom", "about tmsom", "information about the school", "describe tmsom"],
                    answer: "The Mandate School Of Ministry — <b>TMSOM</b> is a <span class='highlight'>6-month</span> intensive class designed to nurture and raise men and women for the work of the ministry spearheaded by the <b>Lady Rev. Juanita N.B Arthur</b> (The Praying Oracle)."
                },
                {
                    questionTerms: ["who is the founder", "principal", "head of the school", "leader", "visioneer", "Rev. Juanita"],
                    answer: "<b>TMSOM</b> is spearheaded by the <span class='highlight'>Lady Rev. Juanita N.B Arthur</span> (The Praying Oracle). She is the leader and founder of <b>Christian Prayer Room Network (CPRN)</b>, a thriving Christian network among the youth. She is known for <span class='highlight'>Prayer and TONGUES OF FIRE</span>. Her vision is to nurture and raise men and women for the work of the ministry"
                },
                {
                    questionTerms: ["tuition fee", "how much", "cost", "payment", "price", "fee"],
                    answer: "Tuition Fee is <span class='highlight'>GH¢300</span> ≈ <span class='highlight'>$19.56</span> (subject to change as currency rate rises or falls). You can start with an installment plan from just <span class='highlight'>GH¢50.00</span> and above. Down-payment is allowed. Tuition Fee covers handout PDF, Exams, and other learning materials if needed. <a href='" + selarLink + "' class='url-button'>Pay Now</a>"
                },
                {
                    questionTerms: ["duration", "how long", "time frame", "length of program", "months"],
                    answer: "The School of Ministry is an intensive <span class='highlight'>six-month</span> course. This year's batch starts from May to October 2025. Attending lectures are compulsory and the duration is <span class='highlight'>3 hours</span>."
                },
                {
                    questionTerms: ["requirements", "need to join", "qualifications", "who can apply", "eligible"],
                    answer: "Committed and yielding individuals who desire to take their journey with the Lord JESUS deeper in ministry. Keep your video ON during lectures to ensure full participation. Three consecutive absence from lectures lead to indefinite suspension except with a valid permission letter or notice."
                },
                {
                    questionTerms: ["venue", "where", "location", "held", "take place"],
                    answer: "Lectures are held on our official mobile App or Web App (after approved registration, Link will be provided to download the App). Kindly test-run the App to ensure that you are familiar with it before lectures."
                },
                {
                    questionTerms: ["graduation", "ordination", "certificate", "completion", "after program"],
                    answer: "Graduation and Ordination will be done after the <span class='highlight'>six months</span> tuition according to your preference. Those who will undergo ORDINATION will go through additional <span class='highlight'>one month</span> training. There will be a requirement the person must meet."
                },
                {
                    questionTerms: ["caution", "rules", "regulation", "must do", "requirements"],
                    answer: "Keep your video ON during lectures to ensure full participation. Three consecutive absence from lectures lead to indefinite suspension except with a valid permission letter or notice."
                },
                {
                    questionTerms: ["hello", "hi", "greetings"],
                    answer: "Hello! 😊 Welcome to The Mandate School Of Ministry. How may I assist you today?"
                },
                {
                    questionTerms: ["thank you", "thanks", "appreciate"],
                    answer: "You're very welcome! 🙏 Let me know if you have any other questions about <b>TMSOM</b>."
                },
                {
                    questionTerms: ["register", "application", "sign up", "join", "enroll", "pay", "payment"],
                    answer: "You can register and make payments for <b>TMSOM</b> here: <a href='" + selarLink + "' class='url-button'>Pay Now</a>",
                    action: () => {
                        window.open(selarLink, '_blank');
                        return true; // Skip normal response
                    }
                }
            ];

            // Front page button handlers
            chatBtn.addEventListener('click', function() {
                frontPage.style.display = 'none';
                chatContainer.style.display = 'flex';
            });
            
            aboutBtn.addEventListener('click', function() {
                frontPage.style.display = 'none';
                aboutContainer.style.display = 'flex';
            });
            
            backBtn.addEventListener('click', function() {
                aboutContainer.style.display = 'none';
                chatContainer.style.display = 'none';
                frontPage.style.display = 'flex';
            });
            
            backToFrontBtn.addEventListener('click', function() {
                chatContainer.style.display = 'none';
                frontPage.style.display = 'flex';
            });

            // Convert URLs in text to clickable buttons
            function convertUrlsToButtons(text) {
                // First remove any existing button tags to prevent duplication
                text = text.replace(/<a[^>]*>([^<]*)<\/a>/g, '$1');
                
                // Then convert URLs to buttons
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, function(url) {
                    const buttonText = url.includes('selar.com') ? 'Pay Now' : 'Visit';
                    return '<a href="' + url + '" target="_blank" class="url-button">' + buttonText + '</a>';
                });
            }

            // Add message to chat
            function addMessage(text, isUser) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
                
                // Create a sanitized version of the text for history (without HTML)
                const sanitizedText = text.replace(/<a[^>]*>([^<]*)<\/a>/g, '$1');
                
                if (isUser) {
                    messageDiv.textContent = text;
                    // Store user message in history
                    const historyItem = {
                        query: text,
                        response: '' // Will be filled when bot responds
                    };
                    chatHistory.unshift(historyItem);
                } else {
                    // For bot messages, convert URLs to buttons and handle HTML
                    const processedText = convertUrlsToButtons(text);
                    messageDiv.innerHTML = processedText;
                    
                    // Update the last history item with the response
                    if (chatHistory.length > 0 && chatHistory[0].response === '') {
                        chatHistory[0].response = sanitizedText;
                        saveHistory();
                        updateHistoryList();
                    }
                }
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            // Save history to localStorage
            function saveHistory() {
                // Keep only the last 50 conversations to prevent excessive storage
                if (chatHistory.length > 50) {
                    chatHistory.length = 50;
                }
                localStorage.setItem('tmsomChatHistory', JSON.stringify(chatHistory));
            }

            // Update the history list display
            function updateHistoryList() {
                historyList.innerHTML = '';
                
                if (chatHistory.length === 0) {
                    const noHistory = document.createElement('div');
                    noHistory.className = 'no-history';
                    noHistory.textContent = 'No chat history yet';
                    historyList.appendChild(noHistory);
                    return;
                }
                
                chatHistory.forEach((item, index) => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.addEventListener('click', () => {
                        loadHistoryItem(index);
                        historyPanel.classList.remove('active');
                    });
                    
                    const query = document.createElement('div');
                    query.className = 'history-query';
                    query.textContent = item.query;
                    
                    const response = document.createElement('div');
                    response.className = 'history-response';
                    response.textContent = item.response || '...';
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-history-item';
                    deleteBtn.innerHTML = '❌';
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteHistoryItem(index);
                    });
                    
                    historyItem.appendChild(query);
                    historyItem.appendChild(response);
                    historyItem.appendChild(deleteBtn);
                    historyList.appendChild(historyItem);
                });
            }

            // Delete a specific history item
            function deleteHistoryItem(index) {
                if (index >= 0 && index < chatHistory.length) {
                    chatHistory.splice(index, 1);
                    saveHistory();
                    updateHistoryList();
                }
            }

            // Clear all chat history
            function clearChatHistory() {
                if (confirm('Are you sure you want to clear all chat history?')) {
                    chatHistory = [];
                    saveHistory();
                    updateHistoryList();
                }
            }

            // Load a history item into the chat
            function loadHistoryItem(index) {
                if (index < 0 || index >= chatHistory.length) return;
                
                const item = chatHistory[index];
                
                // Clear current chat (except welcome messages)
                chatMessages.innerHTML = `
                    <div class="welcome-message">Welcome to TMSOM! How can I help you today? 😊</div>
                    <div class="bot-message">Hi there! I'm your <b>TMSOM</b> assistant. Ask me about our <span class="highlight">6-month</span> ministry program, requirements, fees, or any other details. <a href="https://selar.com/tmsomadmforms" class='url-button'>Pay Now</a></div>
                `;
                
                // Add the history conversation
                addMessage(item.query, true);
                if (item.response) {
                    addMessage(item.response, false);
                }
            }

            // Show typing indicator
            function showTyping() {
                const typingDiv = document.createElement('div');
                typingDiv.classList.add('typing-indicator');
                typingDiv.innerHTML = `
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                `;
                chatMessages.appendChild(typingDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                return typingDiv;
            }

            // Hide typing indicator
            function hideTyping(typingDiv) {
                typingDiv.remove();
            }

            // Calculate similarity between two strings
            function getSimilarity(a, b) {
                const aWords = a.toLowerCase().split(/\s+/);
                const bWords = b.toLowerCase().split(/\s+/);
                let matches = 0;
                
                for (const aWord of aWords) {
                    if (aWord.length < 3) continue;
                    for (const bWord of bWords) {
                        if (bWord.includes(aWord) || aWord.includes(bWord)) {
                            matches++;
                            break;
                        }
                    }
                }
                
                return matches;
            }

            // Find the best matching answer based on similar words
            function findBestMatch(userQuestion) {
                userQuestion = userQuestion.toLowerCase().trim();
                
                // First try exact match on question terms
                for (const item of knowledgeBase) {
                    for (const term of item.questionTerms) {
                        if (userQuestion.includes(term)) {
                            // Check if this response has an action
                            if (item.action) {
                                const skipResponse = item.action();
                                if (skipResponse) return null;
                            }
                            return item.answer;
                        }
                    }
                }
                
                // Then try word similarity matching
                let bestMatch = null;
                let highestScore = 0;
                
                for (const item of knowledgeBase) {
                    let score = 0;
                    
                    // Check against all question terms for this item
                    for (const term of item.questionTerms) {
                        const currentScore = getSimilarity(userQuestion, term);
                        if (currentScore > score) {
                            score = currentScore;
                        }
                    }
                    
                    if (score > highestScore) {
                        highestScore = score;
                        bestMatch = item.answer;
                    }
                }
                
                if (bestMatch && highestScore >= 2) { // Require at least 2 matching words
                    return bestMatch;
                }
                
                // Final fallback
                return "I'm here to provide information about The Mandate School Of Ministry (<b>TMSOM</b>). Could you please rephrase your question? Here are some common topics: program duration (<span class='highlight'>6 months</span>), tuition fees (<span class='highlight'>GH¢300</span>), requirements, or graduation details. <a href='" + selarLink + "' class='url-button'>Pay Now</a>";
            }

            // Process user input
            function processInput() {
                const text = userInput.value.trim();
                if (text === '') return;
                
                addMessage(text, true);
                userInput.value = '';
                
                const typing = showTyping();
                
                // Simulate thinking time
                setTimeout(() => {
                    hideTyping(typing);
                    const response = findBestMatch(text);
                    if (response) {
                        addMessage(response, false);
                    }
                }, 800 + Math.random() * 800);
            }

            // Event listeners
            sendButton.addEventListener('click', processInput);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') processInput();
            });
            
            // Quick question buttons
            quickQuestions.querySelectorAll('.quick-question').forEach(button => {
                if (button.id !== 'register-button') {
                    button.addEventListener('click', () => {
                        userInput.value = button.textContent;
                        processInput();
                    });
                }
            });
            
            // Register/Payment button
            registerButton.addEventListener('click', () => {
                window.open(selarLink, '_blank');
            });
            
            // History button
            historyBtn.addEventListener('click', () => {
                updateHistoryList();
                historyPanel.classList.add('active');
            });
            
            // Close history panel
            closeHistory.addEventListener('click', () => {
                historyPanel.classList.remove('active');
            });
            
            // Clear history button
            clearHistoryBtn.addEventListener('click', clearChatHistory);

            // Initialize history list
            updateHistoryList();
        });

        // Dark Mode Toggle
        function toggleMode() {
            const body = document.body;
            const toggleButton = document.querySelector('.mode-toggle');

            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                toggleButton.textContent = '☀️';
                toggleButton.classList.add('light');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                toggleButton.textContent = '🌙';
                toggleButton.classList.remove('light');
                localStorage.setItem('darkMode', 'disabled');
            }
        };

        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            document.querySelector('.mode-toggle').textContent = '☀️';
            document.querySelector('.mode-toggle').classList.add('light');
        }
 
 
