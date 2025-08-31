    // tsklytlmodal functionality
        const tsklytlmodal = document.getElementById('tooltsklytlmodal');
        const tsklytlmodalTitle = document.getElementById('tsklytlmodalTitle');
        const tsklytlmodalBody = document.getElementById('tsklytlmodalBody');
        const closetsklytlmodal = document.querySelector('.tsklytl-close-modal');
        
        // Close tsklytlmodal when clicking on close button
        closetsklytlmodal.addEventListener('click', () => {
            tsklytlmodal.style.display = 'none';
        });
        
        // Close tsklytlmodal when clicking outside of tsklytlmodal content
        window.addEventListener('click', (e) => {
            if (e.target === tsklytlmodal) {
                tsklytlmodal.style.display = 'none';
            }
        });
        
        // Tool functionality
        document.querySelectorAll('.tsklytl-tool-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const toolName = this.dataset.tool;
                const card = this.closest('.tsklytl-taskly_tool-card');
                const title = card.querySelector('h3').textContent;
                
                // Set tsklytlmodal title
                tsklytlmodalTitle.textContent = title;
                
                // Create ripple effect
                createRipple(this);
                
                // Load tool content
                loadTool(toolName);
                
                // Show tsklytlmodal
                tsklytlmodal.style.display = 'block';
            });
        });
        
        // Create ripple effect
        function createRipple(button) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size/2;
            const y = event.clientY - rect.top - size/2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
        
        // Load tool content
        function loadTool(tool) {
            tsklytlmodalBody.innerHTML = '';
            
            switch(tool) {
                case 'emi':
                    loadEMICalculator();
                    break;
                case 'sip':
                    loadSIPCalculator();
                    break;
                case 'cropper':
                    loadImageCropper();
                    break;
                case 'tsklytlqrCode':
                    loadQRGenerator();
                    break;
                case 'password':
                    loadPasswordGenerator();
                    break;
                case 'wordcounter':
                    loadWordCounter();
                    break;
                case 'formatter':
                    loadTextFormatter();
                    break;
                case 'lorem':
                    loadLoremGenerator();
                    break;
                case 'strength':
                    loadPasswordStrength();
                    break;
                case 'bmi':
                    loadBMICalculator();
                    break;
                case 'age':
                    loadAgeCalculator();
                    break;
                case 'unit':
                    loadUnitConverter();
                    break;
                case 'bpm':
                    loadBPMTapper();
                    break;
                case 'random':
                    loadRandomGenerator();
                    break;
                case 'timer':
                    loadTimerStopwatch();
                    break;
                case 'scicalc':
                    loadScientificCalculator();
                    break;
                case 'datecalc':
                    loadDateCalculator();
                    break;
                case 'tip':
                    loadTipCalculator();
                    break;
                case 'currency':
                    loadCurrencyConverter();
                    break;
                case 'joke':
                    loadJokeGenerator();
                    break;
                case 'quote':
                    loadQuoteGenerator();
                    break;
                case 'textencoder':
                    loadTextEncoder();
                    break;
                case 'url':
                    loadURLEncoder();
                    break;
                case 'water':
                    loadWaterTracker();
                    break;
                case 'calorie':
                    loadCalorieCalculator();
                    break;
                case 'colorpalette':
                    loadColorPalette();
                    break;
                case 'meme':
                    loadMemeGenerator();
                    break;
                case 'roast':
                    loadRoastGenerator();
                    break;
                case 'excuse':
                    loadExcuseGenerator();
                    break;
                case 'tlsemoji':
                    loadEmojiGenerator();
                    break;
                case 'masker':
                    loadDataMasker();
                    break;
                default:
                    loadDefaultTool(tool);
            }
        }

        // EMI Calculator
        function loadEMICalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-calculator"></i> EMI Calculator</h3>
                    <div class="tsinput-group">
                        <label for="loanAmount">Loan Amount ($):</label>
                        <input type="number" id="loanAmount" min="100" max="10000000" value="10000">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="interestRate">Annual Interest Rate (%):</label>
                        <input type="number" id="interestRate" min="1" max="30" step="0.1" value="7.5">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="loanTerm">Loan Term (years):</label>
                        <input type="number" id="loanTerm" min="1" max="30" value="5">
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateEMI">Calculate EMI</button>
                    
                    <div class="tsklytl-emi-result">
                        <div>
                            <h4>Monthly EMI</h4>
                            <div id="emiResult">-</div>
                        </div>
                        <div>
                            <h4>Total Payment</h4>
                            <div id="totalPayment">-</div>
                        </div>
                        <div>
                            <h4>Principal Amount</h4>
                            <div id="principalAmount">-</div>
                        </div>
                        <div>
                            <h4>Total Interest</h4>
                            <div id="totalInterest">-</div>
                        </div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const calculateBtn = document.getElementById('calculateEMI');
            calculateBtn.addEventListener('click', calculateEMI);
            
            function calculateEMI() {
                const loanAmount = parseFloat(document.getElementById('loanAmount').value);
                const interestRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // Monthly rate
                const loanTerm = parseFloat(document.getElementById('loanTerm').value) * 12; // Months
                
                if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
                    alert("Please enter valid numbers");
                    return;
                }
                
                // EMI formula: [P x R x (1+R)^N]/[(1+R)^N-1]
                const emi = loanAmount * interestRate * 
                    Math.pow(1 + interestRate, loanTerm) / 
                    (Math.pow(1 + interestRate, loanTerm) - 1);
                
                const totalPayment = emi * loanTerm;
                const totalInterest = totalPayment - loanAmount;
                
                document.getElementById('emiResult').textContent = `$${emi.toFixed(2)}`;
                document.getElementById('totalPayment').textContent = `$${totalPayment.toFixed(2)}`;
                document.getElementById('principalAmount').textContent = `$${loanAmount.toFixed(2)}`;
                document.getElementById('totalInterest').textContent = `$${totalInterest.toFixed(2)}`;
            }
            
            // Calculate initial EMI
            calculateEMI();
        }
        
        // SIP Calculator
        function loadSIPCalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-coins"></i> SIP Calculator</h3>
                    <div class="tsinput-group">
                        <label for="monthlyInvestment">Monthly Investment ($):</label>
                        <input type="number" id="monthlyInvestment" min="100" max="100000" value="500">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="expectedReturn">Expected Annual Return (%):</label>
                        <input type="number" id="expectedReturn" min="1" max="30" step="0.1" value="12">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="investmentPeriod">Investment Period (years):</label>
                        <input type="number" id="investmentPeriod" min="1" max="40" value="10">
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateSIP">Calculate Returns</button>
                    
                    <div class="tsklytl-sip-result">
                        <div>
                            <h4>Invested Amount</h4>
                            <div id="investedAmount">-</div>
                        </div>
                        <div>
                            <h4>Estimated Returns</h4>
                            <div id="estimatedReturns">-</div>
                        </div>
                        <div>
                            <h4>Total Value</h4>
                            <div id="totalValue">-</div>
                        </div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const calculateBtn = document.getElementById('calculateSIP');
            calculateBtn.addEventListener('click', calculateSIP);
            
            function calculateSIP() {
                const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
                const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) / 100 / 12; // Monthly rate
                const investmentPeriod = parseFloat(document.getElementById('investmentPeriod').value) * 12; // Months
                
                if (isNaN(monthlyInvestment) || isNaN(expectedReturn) || isNaN(investmentPeriod)) {
                    alert("Please enter valid numbers");
                    return;
                }
                
                // Future value of SIP formula: P * [(1+i)^n - 1] / i
                const fv = monthlyInvestment * 
                    (Math.pow(1 + expectedReturn, investmentPeriod) - 1) / 
                    expectedReturn * 
                    (1 + expectedReturn);
                
                const investedAmount = monthlyInvestment * investmentPeriod;
                const estimatedReturns = fv - investedAmount;
                
                document.getElementById('investedAmount').textContent = `$${investedAmount.toFixed(2)}`;
                document.getElementById('estimatedReturns').textContent = `$${estimatedReturns.toFixed(2)}`;
                document.getElementById('totalValue').textContent = `$${fv.toFixed(2)}`;
            }
            
            // Calculate initial SIP
            calculateSIP();
        }
        // QR Code Generator
        function loadQRGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-tsklytlqrCode"></i> QR Code Generator</h3>
                    <div class="tsinput-group">
                        <label for="qrContent">Content to Encode:</label>
                        <textarea id="qrContent" rows="3" placeholder="Enter URL, text, or contact information">https://example.com</textarea>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="qrSize">QR Code Size:</label>
                        <select id="qrSize">
                            <option value="100">100x100</option>
                            <option value="150">150x150</option>
                            <option value="200" selected>200x200</option>
                            <option value="250">250x250</option>
                            <option value="300">300x300</option>
                        </select>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="generateQR">Generate QR Code</button>
                    
                    <div id="tsklytlqrCodeContainer">
                        <div id="tsklytlqrCode"></div>
                        <div id="qrText" style="margin-top: 15px; color: var(--gray);">QR Code will appear here</div>
                    </div>
                    
                    <button class="tlsbtn btn" id="downloadQR" style="display: none;"><i class="fas fa-download"></i> Download QR Code</button>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const generateBtn = document.getElementById('generateQR');
            const downloadBtn = document.getElementById('downloadQR');
            const qrContent = document.getElementById('qrContent');
            const qrSize = document.getElementById('qrSize');
            const tsklytlqrCodeContainer = document.getElementById('tsklytlqrCode');
            const qrText = document.getElementById('qrText');
            
            generateBtn.addEventListener('click', generatetsklytlqrCode);
            downloadBtn.addEventListener('click', downloadtsklytlqrCode);
            
            function generatetsklytlqrCode() {
                const content = qrContent.value.trim();
                if (!content) {
                    alert("Please enter content to encode");
                    return;
                }
                
                const size = parseInt(qrSize.value);
                tsklytlqrCodeContainer.innerHTML = '';
                qrText.textContent = "Generating QR Code...";
                
                // Generate QR code using tsklytlqrCode.js
                const qr = new tsklytlqrCode(tsklytlqrCodeContainer, {
                    text: content,
                    width: size,
                    height: size,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : tsklytlqrCode.CorrectLevel.H
                });
                
                qrText.textContent = "Scan this QR code";
                downloadBtn.style.display = 'block';
            }
            
            function downloadtsklytlqrCode() {
                const canvas = tsklytlqrCodeContainer.querySelector('canvas');
                if (!canvas) {
                    alert("Generate a QR code first");
                    return;
                }
                
                const link = document.createElement('a');
                link.download = 'tsklytlqrCode.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
            
            // Generate initial QR code
            generatetsklytlqrCode();
        }
        
        // Password Generator
        function loadPasswordGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-key"></i> Generate Secure Password</h3>
                    <div class="tsinput-group">
                        <label for="passwordLength">Password Length: <span id="lengthValue">12</span></label>
                        <input type="range" id="passwordLength" min="6" max="30" value="12">
                    </div>
                    
                    <div class="tsklytl-password-options">
                        <div class="tsklytl-option-group">
                            <input type="checkbox" id="uppercase" checked>
                            <label for="uppercase">Uppercase Letters (A-Z)</label>
                        </div>
                        
                        <div class="tsklytl-option-group">
                            <input type="checkbox" id="lowercase" checked>
                            <label for="lowercase">Lowercase Letters (a-z)</label>
                        </div>
                        
                        <div class="tsklytl-option-group">
                            <input type="checkbox" id="numbers" checked>
                            <label for="numbers">Numbers (0-9)</label>
                        </div>
                        
                        <div class="tsklytl-option-group">
                            <input type="checkbox" id="symbols" checked>
                            <label for="symbols">Symbols (!@#$%^&*)</label>
                        </div>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="generateBtn">Generate Password</button>
                    
                    <div class="tsklytl-password-display" id="passwordDisplay">
                        Click "Generate Password"
                    </div>
                    
                    <button class="tlsbtn btn" id="copyBtn"><i class="fas fa-copy"></i> Copy to Clipboard</button>
                </div>
                
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-shield-alt"></i> Password Strength</h3>
                    <div class="tsklytl-strength-meter">
                        <div class="tsklytl-strength-fill" id="strengthFill"></div>
                    </div>
                    <div id="strengthText">Password strength: Medium</div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const passwordLength = document.getElementById('passwordLength');
            const lengthValue = document.getElementById('lengthValue');
            const passwordDisplay = document.getElementById('passwordDisplay');
            const generateBtn = document.getElementById('generateBtn');
            const copyBtn = document.getElementById('copyBtn');
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            
            passwordLength.addEventListener('input', () => {
                lengthValue.textContent = passwordLength.value;
            });
            
            generateBtn.addEventListener('click', generatePassword);
            copyBtn.addEventListener('click', copyPassword);
            
            function generatePassword() {
                const length = parseInt(passwordLength.value);
                const uppercase = document.getElementById('uppercase').checked;
                const lowercase = document.getElementById('lowercase').checked;
                const numbers = document.getElementById('numbers').checked;
                const symbols = document.getElementById('symbols').checked;
                
                if (!uppercase && !lowercase && !numbers && !symbols) {
                    alert("Please select at least one character type");
                    return;
                }
                
                const charset = [];
                if (uppercase) charset.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                if (lowercase) charset.push('abcdefghijklmnopqrstuvwxyz');
                if (numbers) charset.push('0123456789');
                if (symbols) charset.push('!@#$%^&*()_+-=[]{}|;:,.<>?');
                
                const allChars = charset.join('');
                let password = '';
                
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * allChars.length);
                    password += allChars.charAt(randomIndex);
                }
                
                passwordDisplay.textContent = password;
                calculateStrength(password);
            }
            
            function calculateStrength(password) {
                let strength = 0;
                
                // Length contributes up to 50% of strength
                strength += Math.min(password.length / 30 * 50, 50);
                
                // Character variety contributes up to 50%
                const hasUppercase = /[A-Z]/.test(password);
                const hasLowercase = /[a-z]/.test(password);
                const hasNumbers = /[0-9]/.test(password);
                const hasSymbols = /[^A-Za-z0-9]/.test(password);
                
                const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
                strength += varietyCount * 12.5;
                
                strengthFill.style.width = `${strength}%`;
                
                if (strength < 40) {
                    strengthFill.style.background = 'var(--danger)';
                    strengthText.textContent = 'Password strength: Weak';
                } else if (strength < 70) {
                    strengthFill.style.background = 'var(--warning)';
                    strengthText.textContent = 'Password strength: Medium';
                } else {
                    strengthFill.style.background = 'var(--success)';
                    strengthText.textContent = 'Password strength: Strong';
                }
            }
            
            function copyPassword() {
                const password = passwordDisplay.textContent;
                if (!password || password === 'Click "Generate Password"') {
                    alert("Generate a password first");
                    return;
                }
                
                navigator.clipboard.writeText(password)
                    .then(() => {
                        const originalText = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyBtn.innerHTML = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy: ', err);
                        alert("Failed to copy password to clipboard");
                    });
            }
            
            // Generate initial password
            generatePassword();
        }
        
        // Word Counter
        function loadWordCounter() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-font"></i> Word Counter</h3>
                    <div class="tsinput-group">
                        <label for="textInput">Enter your text:</label>
                        <textarea id="textInput" rows="8" placeholder="Type or paste your text here..."></textarea>
                    </div>
                    
                    <div class="tsklytl-result-box">
                        <div id="wordCount">Words: 0</div>
                        <div id="charCount"> Characters: 0</div>
                        <div id="sentenceCount"> Sentences: 0</div>
                        <div id="paragraphCount"> Paragraphs: 0</div>
                        <div id="readingTime"> Reading time: 0 min</div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const textInput = document.getElementById('textInput');
            const wordCount = document.getElementById('wordCount');
            const charCount = document.getElementById('charCount');
            const sentenceCount = document.getElementById('sentenceCount');
            const paragraphCount = document.getElementById('paragraphCount');
            const readingTime = document.getElementById('readingTime');
            
            textInput.addEventListener('input', countWords);
            
            function countWords() {
                const text = textInput.value.trim();
                
                // Word count (split by spaces)
                const words = text.match(/\b\w+\b/g) || [];
                const wordCountValue = words.length;
                
                // Character count (including spaces)
                const charCountValue = text.length;
                
                // Sentence count (split by . ! ?)
                const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                const sentenceCountValue = sentences.length;
                
                // Paragraph count (split by line breaks)
                const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
                const paragraphCountValue = paragraphs.length;
                
                // Reading time (200 words per minute)
                const minutes = Math.ceil(wordCountValue / 200);
                
                wordCount.textContent = `Words: ${wordCountValue}`;
                charCount.textContent = `Characters: ${charCountValue}`;
                sentenceCount.textContent = `Sentences: ${sentenceCountValue}`;
                paragraphCount.textContent = `Paragraphs: ${paragraphCountValue}`;
                readingTime.textContent = `Reading time: ${minutes} min`;
            }
            
            // Initialize counts
            countWords();
        }
        
        // Text Formatter
        function loadTextFormatter() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-text-height"></i> Text Formatting</h3>
                    <div class="tsinput-group">
                        <label for="textToFormat">Enter your text:</label>
                        <textarea id="textToFormat" rows="6" placeholder="Type or paste your text here..."></textarea>
                    </div>
                    
                    <div class="tsinput-group">
                        <label>Format Options:</label>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="tlsbtn btn" data-format="uppercase">UPPERCASE</button>
                            <button class="tlsbtn btn" data-format="lowercase">lowercase</button>
                            <button class="tlsbtn btn" data-format="sentence">Sentence case</button>
                            <button class="tlsbtn btn" data-format="title">Title Case</button>
                            <button class="tlsbtn btn" data-format="invert">iNVERT cASE</button>
                            <button class="tlsbtn btn" data-format="copy">Copy Text</button>
                        </div>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="formattedText">Formatted Text:</label>
                        <textarea id="formattedText" rows="6" readonly></textarea>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const textToFormat = document.getElementById('textToFormat');
            const formattedText = document.getElementById('formattedText');
            const formatButtons = document.querySelectorAll('[data-format]');
            
            textToFormat.addEventListener('input', () => {
                formattedText.value = textToFormat.value;
            });
            
            formatButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const formatType = button.dataset.format;
                    let text = textToFormat.value;
                    
                    switch(formatType) {
                        case 'uppercase':
                            text = text.toUpperCase();
                            break;
                        case 'lowercase':
                            text = text.toLowerCase();
                            break;
                        case 'sentence':
                            text = text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, match => match.toUpperCase());
                            break;
                        case 'title':
                            text = text.toLowerCase().replace(/\b\w/g, match => match.toUpperCase());
                            break;
                        case 'invert':
                            text = text.split('').map(char => 
                                char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
                            ).join('');
                            break;
                        case 'copy':
                            navigator.clipboard.writeText(formattedText.value)
                                .then(() => {
                                    const originalText = button.textContent;
                                    button.textContent = 'Copied!';
                                    setTimeout(() => {
                                        button.textContent = originalText;
                                    }, 2000);
                                });
                            return;
                    }
                    
                    formattedText.value = text;
                });
            });
        }
        
        // Lorem Ipsum Generator
        function loadLoremGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-paragraph"></i> Lorem Ipsum Generator</h3>
                    <div class="tsinput-group">
                        <label for="loremType">Content Type:</label>
                        <select id="loremType">
                            <option value="paragraphs">Paragraphs</option>
                            <option value="sentences">Sentences</option>
                            <option value="words">Words</option>
                        </select>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="loremAmount">Amount:</label>
                        <input type="number" id="loremAmount" min="1" max="50" value="3">
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="generateLorem">Generate Text</button>
                    
                    <div class="tsinput-group">
                        <label for="loremOutput">Generated Text:</label>
                        <textarea id="loremOutput" rows="8" readonly></textarea>
                    </div>
                    
                    <button class="tlsbtn btn" id="copyLorem">Copy to Clipboard</button>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const loremType = document.getElementById('loremType');
            const loremAmount = document.getElementById('loremAmount');
            const loremOutput = document.getElementById('loremOutput');
            const generateLorem = document.getElementById('generateLorem');
            const copyLorem = document.getElementById('copyLorem');
            
            const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
            
            generateLorem.addEventListener('click', generateLoremText);
            copyLorem.addEventListener('click', () => {
                navigator.clipboard.writeText(loremOutput.value)
                    .then(() => {
                        const originalText = copyLorem.textContent;
                        copyLorem.textContent = 'Copied!';
                        setTimeout(() => {
                            copyLorem.textContent = originalText;
                        }, 2000);
                    });
            });
            
            function generateLoremText() {
                const type = loremType.value;
                const amount = parseInt(loremAmount.value);
                
                if (isNaN(amount) || amount < 1 || amount > 50) {
                    alert("Please enter a number between 1 and 50");
                    return;
                }
                
                let output = '';
                
                switch(type) {
                    case 'paragraphs':
                        for (let i = 0; i < amount; i++) {
                            output += loremText + '\n\n';
                        }
                        break;
                    case 'sentences':
                        const sentences = loremText.split('. ').filter(s => s.trim().length > 0);
                        for (let i = 0; i < Math.min(amount, sentences.length); i++) {
                            output += sentences[i] + '. ';
                        }
                        break;
                    case 'words':
                        const words = loremText.split(' ');
                        for (let i = 0; i < Math.min(amount, words.length); i++) {
                            output += words[i] + ' ';
                        }
                        break;
                }
                
                loremOutput.value = output.trim();
            }
            
            // Generate initial text
            generateLoremText();
        }
        
        // Password Strength Checker
        function loadPasswordStrength() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-shield-alt"></i> Password Strength Checker</h3>
                    <div class="tsinput-group">
                        <label for="passwordInput">Enter your password:</label>
                        <input type="text" id="passwordInput" placeholder="Type your password...">
                    </div>
                    
                    <div class="tsklytl-strength-meter">
                        <div class="tsklytl-strength-fill" id="pwStrengthFill"></div>
                    </div>
                    <div id="pwStrengthText">Password strength: Medium</div>
                    
                    <div class="tsklytl-result-box">
                        <div>
                            <h4 class="text-white">Password Analysis:</h4>
                        </div>
                        <div>
                            <div id="passwordAnalysis"></div>
                        </div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const passwordInput = document.getElementById('passwordInput');
            const pwStrengthFill = document.getElementById('pwStrengthFill');
            const pwStrengthText = document.getElementById('pwStrengthText');
            const passwordAnalysis = document.getElementById('passwordAnalysis');
            
            passwordInput.addEventListener('input', checkPasswordStrength);
            
            function checkPasswordStrength() {
                const password = passwordInput.value;
                let strength = 0;
                let analysis = [];
                
                // Length contributes up to 30% of strength
                if (password.length >= 12) strength += 30;
                else if (password.length >= 8) strength += 20;
                else if (password.length >= 6) strength += 10;
                else analysis.push("Password is too short (min 6 characters)");
                
                // Character variety
                const hasUppercase = /[A-Z]/.test(password);
                const hasLowercase = /[a-z]/.test(password);
                const hasNumbers = /[0-9]/.test(password);
                const hasSymbols = /[^A-Za-z0-9]/.test(password);
                
                if (hasUppercase) strength += 10;
                else analysis.push("Add uppercase letters");
                
                if (hasLowercase) strength += 10;
                else analysis.push("Add lowercase letters");
                
                if (hasNumbers) strength += 10;
                else analysis.push("Add numbers");
                
                if (hasSymbols) strength += 10;
                else analysis.push("Add symbols");
                
                // Complexity (no common patterns)
                const commonPatterns = [
                    "123", "abc", "qwerty", "password", "admin", "letmein", "welcome"
                ];
                
                let hasCommonPattern = false;
                for (const pattern of commonPatterns) {
                    if (password.toLowerCase().includes(pattern)) {
                        strength -= 20;
                        analysis.push("Avoid common patterns");
                        hasCommonPattern = true;
                        break;
                    }
                }
                
                // Repeated characters
                const hasRepeats = /(.)\1{2,}/.test(password);
                if (hasRepeats) {
                    strength -= 15;
                    analysis.push("Avoid repeated characters");
                }
                
                // Cap strength at 100
                strength = Math.min(Math.max(strength, 0), 100);
                
                pwStrengthFill.style.width = `${strength}%`;
                
                if (strength < 40) {
                    pwStrengthFill.style.background = 'var(--danger)';
                    pwStrengthText.textContent = 'Password strength: Weak';
                } else if (strength < 70) {
                    pwStrengthFill.style.background = 'var(--warning)';
                    pwStrengthText.textContent = 'Password strength: Medium';
                } else {
                    pwStrengthFill.style.background = 'var(--success)';
                    pwStrengthText.textContent = 'Password strength: Strong';
                }
                
                if (password.length === 0) {
                    passwordAnalysis.innerHTML = 'Enter a password to analyze';
                } else if (analysis.length === 0) {
                    passwordAnalysis.innerHTML = 'Your password is strong!';
                } else {
                    passwordAnalysis.innerHTML = '<ul>' + 
                        analysis.map(item => `<li>${item}</li>`).join('') + 
                        '</ul>';
                }
            }
            
            // Initialize analysis
            checkPasswordStrength();
        }
        
        // BMI Calculator
        function loadBMICalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-weight"></i> BMI Calculator</h3>
                    <div class="tsinput-group">
                        <label>Unit System:</label>
                        <div style="display: flex; gap: 10px;">
                            <label><input type="radio" name="unit" value="metric" checked> Metric (kg, cm)</label>
                            <label><input type="radio" name="unit" value="imperial"> Imperial (lb, in)</label>
                        </div>
                    </div>
                    
                    <div id="metricInputs">
                        <div class="tsinput-group">
                            <label for="heightCm">Height (cm):</label>
                            <input type="number" id="heightCm" min="50" max="250" value="170">
                        </div>
                        
                        <div class="tsinput-group">
                            <label for="weightKg">Weight (kg):</label>
                            <input type="number" id="weightKg" min="20" max="300" value="70">
                        </div>
                    </div>
                    
                    <div id="imperialInputs" style="display: none;">
                        <div class="tsinput-group">
                            <label for="heightFt">Height (feet):</label>
                            <input type="number" id="heightFt" min="3" max="8" value="5">
                        </div>
                        
                        <div class="tsinput-group">
                            <label for="heightIn">Height (inches):</label>
                            <input type="number" id="heightIn" min="0" max="11" value="7">
                        </div>
                        
                        <div class="tsinput-group">
                            <label for="weightLb">Weight (lb):</label>
                            <input type="number" id="weightLb" min="50" max="700" value="150">
                        </div>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateBmi">Calculate BMI</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="bmiResult">Your BMI: </div>
                        <div id="bmiCategory">Category: </div>
                    </div>
                </div>
                
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-info-circle"></i> BMI Categories</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>Underweight</div>
                        <div>&lt; 18.5</div>
                        <div>Normal weight</div>
                        <div>18.5 - 24.9</div>
                        <div>Overweight</div>
                        <div>25 - 29.9</div>
                        <div>Obesity</div>
                        <div>&ge; 30</div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const unitRadios = document.querySelectorAll('input[name="unit"]');
            const metricInputs = document.getElementById('metricInputs');
            const imperialInputs = document.getElementById('imperialInputs');
            const calculateBmi = document.getElementById('calculateBmi');
            const bmiResult = document.getElementById('bmiResult');
            const bmiCategory = document.getElementById('bmiCategory');
            
            unitRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.value === 'metric') {
                        metricInputs.style.display = 'block';
                        imperialInputs.style.display = 'none';
                    } else {
                        metricInputs.style.display = 'none';
                        imperialInputs.style.display = 'block';
                    }
                    calculateBMI();
                });
            });
            
            // Add input event listeners to all inputs
            document.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('input', calculateBMI);
            });
            
            function calculateBMI() {
                let bmi;
                const unit = document.querySelector('input[name="unit"]:checked').value;
                
                if (unit === 'metric') {
                    const heightCm = parseFloat(document.getElementById('heightCm').value);
                    const weightKg = parseFloat(document.getElementById('weightKg').value);
                    
                    if (isNaN(heightCm) || isNaN(weightKg)) return;
                    
                    const heightM = heightCm / 100;
                    bmi = weightKg / (heightM * heightM);
                } else {
                    const heightFt = parseFloat(document.getElementById('heightFt').value);
                    const heightIn = parseFloat(document.getElementById('heightIn').value);
                    const weightLb = parseFloat(document.getElementById('weightLb').value);
                    
                    if (isNaN(heightFt) || isNaN(heightIn) || isNaN(weightLb)) return;
                    
                    const totalInches = heightFt * 12 + heightIn;
                    bmi = (weightLb / (totalInches * totalInches)) * 703;
                }
                
                bmi = bmi.toFixed(1);
                bmiResult.textContent = `Your BMI: ${bmi}`;
                
                if (bmi < 18.5) {
                    bmiCategory.textContent = 'Category: Underweight';
                    bmiCategory.style.color = 'var(--warning)';
                } else if (bmi < 25) {
                    bmiCategory.textContent = 'Category: Normal weight';
                    bmiCategory.style.color = 'var(--success)';
                } else if (bmi < 30) {
                    bmiCategory.textContent = 'Category: Overweight';
                    bmiCategory.style.color = 'var(--warning)';
                } else {
                    bmiCategory.textContent = 'Category: Obesity';
                    bmiCategory.style.color = 'var(--danger)';
                }
            }
            
            // Calculate initial BMI
            calculateBMI();
        }
        
        // Age Calculator
        function loadAgeCalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-birthday-cake"></i> Age Calculator</h3>
                    <div class="tsinput-group">
                        <label for="birthDate">Your Birth Date:</label>
                        <input type="date" id="birthDate" value="1990-01-01">
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateAge">Calculate Age</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="ageResult"></div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const birthDate = document.getElementById('birthDate');
            const calculateAge = document.getElementById('calculateAge');
            const ageResult = document.getElementById('ageResult');
            
            calculateAge.addEventListener('click', calculateAgeFunc);
            
            function calculateAgeFunc() {
                const birthDateValue = new Date(birthDate.value);
                const today = new Date();
                
                if (birthDateValue > today) {
                    ageResult.textContent = "Birth date cannot be in the future!";
                    return;
                }
                
                let years = today.getFullYear() - birthDateValue.getFullYear();
                let months = today.getMonth() - birthDateValue.getMonth();
                let days = today.getDate() - birthDateValue.getDate();
                
                if (days < 0) {
                    months--;
                    // Get days in previous month
                    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                    days += prevMonth.getDate();
                }
                
                if (months < 0) {
                    years--;
                    months += 12;
                }
                
                // Calculate total days
                const diffTime = Math.abs(today - birthDateValue);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                // Calculate weeks
                const weeks = Math.floor(diffDays / 7);
                
                ageResult.innerHTML = `
                    <div>You are <strong>${years}</strong> years, <strong>${months}</strong> months, and <strong>${days}</strong> days old</div>
                    <div>Total: <strong>${diffDays}</strong> days or <strong>${weeks}</strong> weeks</div>
                    <div>Next birthday in: <strong>${getDaysUntilNextBirthday(birthDateValue, today)}</strong> days</div>
                `;
            }
            
            function getDaysUntilNextBirthday(birthDate, today) {
                const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                if (nextBirthday < today) {
                    nextBirthday.setFullYear(today.getFullYear() + 1);
                }
                const diffTime = nextBirthday - today;
                return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            
            // Set max date to today
            const today = new Date();
            const maxDate = today.toISOString().split('T')[0];
            birthDate.max = maxDate;
            
            // Calculate initial age
            calculateAgeFunc();
        }
        
        // Unit Converter
        function loadUnitConverter() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-ruler"></i> Unit Converter</h3>
                    <div class="tsinput-group">
                        <label for="unitValue">Value:</label>
                        <input type="number" id="unitValue" value="1" min="0">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="unitCategory">Category:</label>
                        <select id="unitCategory">
                            <option value="length">Length</option>
                            <option value="weight">Weight</option>
                            <option value="temperature">Temperature</option>
                            <option value="volume">Volume</option>
                        </select>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="fromUnit">From:</label>
                        <select id="fromUnit"></select>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="toUnit">To:</label>
                        <select id="toUnit"></select>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="convertUnit">Convert</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="unitResult"></div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const unitValue = document.getElementById('unitValue');
            const unitCategory = document.getElementById('unitCategory');
            const fromUnit = document.getElementById('fromUnit');
            const toUnit = document.getElementById('toUnit');
            const convertUnit = document.getElementById('convertUnit');
            const unitResult = document.getElementById('unitResult');
            
            const units = {
                length: [
                    { name: 'Millimeters', factor: 0.001 },
                    { name: 'Centimeters', factor: 0.01 },
                    { name: 'Meters', factor: 1 },
                    { name: 'Kilometers', factor: 1000 },
                    { name: 'Inches', factor: 0.0254 },
                    { name: 'Feet', factor: 0.3048 },
                    { name: 'Yards', factor: 0.9144 },
                    { name: 'Miles', factor: 1609.344 }
                ],
                weight: [
                    { name: 'Milligrams', factor: 0.000001 },
                    { name: 'Grams', factor: 0.001 },
                    { name: 'Kilograms', factor: 1 },
                    { name: 'Metric Tons', factor: 1000 },
                    { name: 'Ounces', factor: 0.0283495 },
                    { name: 'Pounds', factor: 0.453592 },
                    { name: 'US Tons', factor: 907.185 }
                ],
                temperature: [
                    { name: 'Celsius', factor: 1 },
                    { name: 'Fahrenheit', factor: 1 },
                    { name: 'Kelvin', factor: 1 }
                ],
                volume: [
                    { name: 'Milliliters', factor: 0.001 },
                    { name: 'Liters', factor: 1 },
                    { name: 'Cubic Meters', factor: 1000 },
                    { name: 'Teaspoons', factor: 0.00492892 },
                    { name: 'Tablespoons', factor: 0.0147868 },
                    { name: 'Fluid Ounces', factor: 0.0295735 },
                    { name: 'Cups', factor: 0.24 },
                    { name: 'Pints', factor: 0.473176 },
                    { name: 'Quarts', factor: 0.946353 },
                    { name: 'Gallons', factor: 3.78541 }
                ]
            };
            
            // Initialize units
            populateUnits();
            unitCategory.addEventListener('change', populateUnits);
            convertUnit.addEventListener('click', convertUnits);
            
            function populateUnits() {
                const category = unitCategory.value;
                const unitList = units[category];
                
                // Clear existing options
                fromUnit.innerHTML = '';
                toUnit.innerHTML = '';
                
                // Add new options
                unitList.forEach(unit => {
                    const fromOption = document.createElement('option');
                    fromOption.value = unit.name;
                    fromOption.textContent = unit.name;
                    fromUnit.appendChild(fromOption);
                    
                    const toOption = document.createElement('option');
                    toOption.value = unit.name;
                    toOption.textContent = unit.name;
                    
                    // Select different default for "to" unit
                    if (unit.name === unitList[1].name) {
                        toOption.selected = true;
                    }
                    
                    toUnit.appendChild(toOption);
                });
                
                // For temperature, set appropriate defaults
                if (category === 'temperature') {
                    fromUnit.value = 'Celsius';
                    toUnit.value = 'Fahrenheit';
                }
            }
            
            function convertUnits() {
                const value = parseFloat(unitValue.value);
                if (isNaN(value)) {
                    unitResult.textContent = "Please enter a valid number";
                    return;
                }
                
                const category = unitCategory.value;
                const from = fromUnit.value;
                const to = toUnit.value;
                
                if (category === 'temperature') {
                    convertTemperature(value, from, to);
                } else {
                    convertStandard(value, from, to, category);
                }
            }
            
            function convertStandard(value, from, to, category) {
                const unitList = units[category];
                const fromUnitObj = unitList.find(u => u.name === from);
                const toUnitObj = unitList.find(u => u.name === to);
                
                if (!fromUnitObj || !toUnitObj) {
                    unitResult.textContent = "Invalid units selected";
                    return;
                }
                
                // Convert to base unit first
                const baseValue = value * fromUnitObj.factor;
                const result = baseValue / toUnitObj.factor;
                
                unitResult.textContent = `${value} ${from} = ${result.toFixed(6)} ${to}`;
            }
            
            function convertTemperature(value, from, to) {
                let result;
                
                if (from === to) {
                    result = value;
                } else if (from === 'Celsius') {
                    if (to === 'Fahrenheit') {
                        result = (value * 9/5) + 32;
                    } else { // Kelvin
                        result = value + 273.15;
                    }
                } else if (from === 'Fahrenheit') {
                    if (to === 'Celsius') {
                        result = (value - 32) * 5/9;
                    } else { // Kelvin
                        result = (value - 32) * 5/9 + 273.15;
                    }
                } else { // Kelvin
                    if (to === 'Celsius') {
                        result = value - 273.15;
                    } else { // Fahrenheit
                        result = (value - 273.15) * 9/5 + 32;
                    }
                }
                
                unitResult.textContent = `${value} ${from} = ${result.toFixed(2)} ${to}`;
            }
            
            // Perform initial conversion
            populateUnits();
            convertUnits();
        }
        
        // BPM Tapper
        function loadBPMTapper() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-music"></i> BPM Tapper</h3>
                    <div class="tsklytl-result-box" style="text-align: center; font-size: 2rem; min-height: 100px; display: flex; align-items: center; justify-content: center;">
                        <div id="bpmDisplay">Tap to start</div>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="tapBtn">Tap to the Beat</button>
                    <button class="mt-1 btn" id="resetBpm">Reset</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="tapInfo">Tap the button in rhythm with the music to calculate BPM</div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const tapBtn = document.getElementById('tapBtn');
            const resetBpm = document.getElementById('resetBpm');
            const bpmDisplay = document.getElementById('bpmDisplay');
            const tapInfo = document.getElementById('tapInfo');
            
            let tapTimes = [];
            let timeout;
            
            tapBtn.addEventListener('click', recordTap);
            resetBpm.addEventListener('click', resetTapper);
            
            function recordTap() {
                const now = Date.now();
                
                // Clear any existing timeout
                if (timeout) clearTimeout(timeout);
                
                // Add this tap time
                tapTimes.push(now);
                
                // We need at least 2 taps to calculate
                if (tapTimes.length > 1) {
                    // Calculate average time between taps
                    const timeDiffs = [];
                    for (let i = 1; i < tapTimes.length; i++) {
                        timeDiffs.push(tapTimes[i] - tapTimes[i - 1]);
                    }
                    
                    const avgTime = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
                    const bpm = Math.round(60000 / avgTime);
                    
                    bpmDisplay.textContent = `${bpm} BPM`;
                    tapInfo.textContent = `${tapTimes.length} taps recorded`;
                } else {
                    bpmDisplay.textContent = "Tap again...";
                    tapInfo.textContent = "First tap recorded";
                }
                
                // Set timeout to reset if no taps for 2 seconds
                timeout = setTimeout(() => {
                    if (tapTimes.length > 1) {
                        tapInfo.textContent = "Stopped. Tap 'Reset' to start over";
                    } else {
                        resetTapper();
                    }
                }, 2000);
            }
            
            function resetTapper() {
                tapTimes = [];
                bpmDisplay.textContent = "Tap to start";
                tapInfo.textContent = "Tap the button in rhythm with the music to calculate BPM";
                if (timeout) clearTimeout(timeout);
            }
        }
        
        // Random Generator
        function loadRandomGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-dice"></i> Random Generator</h3>
                    <div class="tsinput-group">
                        <label for="randomType">Generate:</label>
                        <select id="randomType">
                            <option value="number">Number</option>
                            <option value="dice">Dice Roll</option>
                            <option value="coin">Coin Flip</option>
                            <option value="color">Color</option>
                            <option value="decision">Decision</option>
                        </select>
                    </div>
                    
                    <div id="numberOptions">
                        <div class="tsinput-group">
                            <label for="minNumber">Min:</label>
                            <input type="number" id="minNumber" value="1">
                        </div>
                        
                        <div class="tsinput-group">
                            <label for="maxNumber">Max:</label>
                            <input type="number" id="maxNumber" value="100">
                        </div>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="generateRandom">Generate</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="randomResult" style="font-size: 1.5rem; text-align: center;"></div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const randomType = document.getElementById('randomType');
            const numberOptions = document.getElementById('numberOptions');
            const minNumber = document.getElementById('minNumber');
            const maxNumber = document.getElementById('maxNumber');
            const generateRandom = document.getElementById('generateRandom');
            const randomResult = document.getElementById('randomResult');
            
            randomType.addEventListener('change', () => {
                if (randomType.value === 'number') {
                    numberOptions.style.display = 'block';
                } else {
                    numberOptions.style.display = 'none';
                }
            });
            
            generateRandom.addEventListener('click', generateRandomValue);
            
            function generateRandomValue() {
                const type = randomType.value;
                let result;
                
                switch(type) {
                    case 'number':
                        const min = parseInt(minNumber.value);
                        const max = parseInt(maxNumber.value);
                        
                        if (isNaN(min) || isNaN(max) || min >= max) {
                            result = "Invalid range";
                        } else {
                            result = Math.floor(Math.random() * (max - min + 1)) + min;
                        }
                        break;
                        
                    case 'dice':
                        result = Math.floor(Math.random() * 6) + 1;
                        result = `Dice roll: ${result}`;
                        break;
                        
                    case 'coin':
                        result = Math.random() < 0.5 ? "Heads" : "Tails";
                        result = `Coin flip: ${result}`;
                        break;
                        
                    case 'color':
                        const r = Math.floor(Math.random() * 256);
                        const g = Math.floor(Math.random() * 256);
                        const b = Math.floor(Math.random() * 256);
                        result = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                        randomResult.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                        break;
                        
                    case 'decision':
                        const decisions = ["Yes", "No", "Maybe", "Try Again", "Absolutely", "Not Now"];
                        result = decisions[Math.floor(Math.random() * decisions.length)];
                        break;
                }
                
                randomResult.textContent = result;
            }
            
            // Generate initial random value
            generateRandomValue();
        }
        
        // Timer & Stopwatch
        function loadTimerStopwatch() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-stopwatch"></i> Timer & Stopwatch</h3>
                    <div class="tsinput-group">
                        <label>Mode:</label>
                        <div style="display: flex; gap: 10px;">
                            <label><input type="radio" name="timermode" value="stopwatch" checked> Stopwatch</label>
                            <label><input type="radio" name="timermode" value="timer"> Timer</label>
                        </div>
                    </div>
                    
                    <!-- Stopwatch Content -->
                    <div id="stopwatchContent">
                        <div class="tsklytl-stopwatch-display" id="stopwatchDisplay">00:00:00.00</div>
                        <div class="tsklytl-stopwatch-controls">
                            <button class="tlsbtn btn" id="startStopwatch">Start</button>
                            <button class="tlsbtn btn" id="lapStopwatch">Lap</button>
                            <button class="tlsbtn btn" id="resetStopwatch">Reset</button>
                        </div>
                        <div class="tsklytl-lap-list" id="lapList"></div>
                    </div>
                    
                    <!-- Timer Content -->
                    <div id="timerContent" style="display: none;">
                        <div class="tsinput-group">
                            <label for="timerHours">Hours:</label>
                            <input type="number" id="timerHours" min="0" max="24" value="0">
                        </div>
                        
                        <div class="tsinput-group">
                            <label for="timerMinutes">Minutes:</label>
                            <input type="number" id="timerMinutes" min="0" max="59" value="0">
                        </div>
                        
                        <div class="tsinput-group">
                            <label for="timerSeconds">Seconds:</label>
                            <input type="number" id="timerSeconds" min="0" max="59" value="0">
                        </div>
                        
                        <div class="tsklytl-stopwatch-display" id="timerDisplay">00:00:00</div>
                        <div class="tsklytl-stopwatch-controls">
                            <button class="tlsbtn btn" id="startTimer">Start</button>
                            <button class="tlsbtn btn" id="pauseTimer">Pause</button>
                            <button class="tlsbtn btn" id="resetTimer">Reset</button>
                        </div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            // Mode switch
            const timerModeRadios = document.querySelectorAll('input[name="timermode"]');
            const stopwatchContent = document.getElementById('stopwatchContent');
            const timerContent = document.getElementById('timerContent');
            
            timerModeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.value === 'stopwatch') {
                        stopwatchContent.style.display = 'block';
                        timerContent.style.display = 'none';
                    } else {
                        stopwatchContent.style.display = 'none';
                        timerContent.style.display = 'block';
                    }
                });
            });
            
            // Stopwatch functionality
            let stopwatchInterval;
            let stopwatchRunning = false;
            let stopwatchTime = 0;
            let stopwatchStartTime = 0;
            const stopwatchDisplay = document.getElementById('stopwatchDisplay');
            const startStopwatch = document.getElementById('startStopwatch');
            const lapStopwatch = document.getElementById('lapStopwatch');
            const resetStopwatch = document.getElementById('resetStopwatch');
            const lapList = document.getElementById('lapList');
            
            startStopwatch.addEventListener('click', toggleStopwatch);
            lapStopwatch.addEventListener('click', recordLap);
            resetStopwatch.addEventListener('click', resetStopwatchFunc);
            
            function toggleStopwatch() {
                if (stopwatchRunning) {
                    clearInterval(stopwatchInterval);
                    startStopwatch.textContent = "Start";
                } else {
                    stopwatchStartTime = Date.now() - stopwatchTime;
                    stopwatchInterval = setInterval(updateStopwatch, 10);
                    startStopwatch.textContent = "Stop";
                }
                stopwatchRunning = !stopwatchRunning;
            }
            
            function updateStopwatch() {
                stopwatchTime = Date.now() - stopwatchStartTime;
                displayStopwatchTime(stopwatchTime);
            }
            
            function displayStopwatchTime(time) {
                const hours = Math.floor(time / 3600000);
                const minutes = Math.floor((time % 3600000) / 60000);
                const seconds = Math.floor((time % 60000) / 1000);
                const milliseconds = Math.floor((time % 1000) / 10);
                
                stopwatchDisplay.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
            }
            
            function recordLap() {
                if (!stopwatchRunning) return;
                
                const lapTime = stopwatchDisplay.textContent;
                const lapItem = document.createElement('div');
                lapItem.classList.add('tsklytl-lap-item');
                lapItem.textContent = `Lap ${lapList.children.length + 1}: ${lapTime}`;
                lapList.prepend(lapItem);
            }
            
            function resetStopwatchFunc() {
                clearInterval(stopwatchInterval);
                stopwatchRunning = false;
                stopwatchTime = 0;
                displayStopwatchTime(0);
                startStopwatch.textContent = "Start";
                lapList.innerHTML = '';
            }
            
            // Timer functionality
            let timerInterval;
            let timerRunning = false;
            let timerTime = 0;
            const timerHours = document.getElementById('timerHours');
            const timerMinutes = document.getElementById('timerMinutes');
            const timerSeconds = document.getElementById('timerSeconds');
            const timerDisplay = document.getElementById('timerDisplay');
            const startTimer = document.getElementById('startTimer');
            const pauseTimer = document.getElementById('pauseTimer');
            const resetTimer = document.getElementById('resetTimer');
            
            startTimer.addEventListener('click', toggleTimer);
            pauseTimer.addEventListener('click', pauseTimerFunc);
            resetTimer.addEventListener('click', resetTimerFunc);
            
            function toggleTimer() {
                if (timerRunning) return;
                
                const hours = parseInt(timerHours.value) || 0;
                const minutes = parseInt(timerMinutes.value) || 0;
                const seconds = parseInt(timerSeconds.value) || 0;
                
                timerTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
                
                if (timerTime <= 0) {
                    alert("Please enter a valid time");
                    return;
                }
                
                const startTime = Date.now();
                timerInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(0, timerTime - elapsed);
                    
                    if (remaining <= 0) {
                        clearInterval(timerInterval);
                        timerDisplay.textContent = "00:00:00";
                        alert("Timer completed!");
                        timerRunning = false;
                        startTimer.textContent = "Start";
                        return;
                    }
                    
                    displayTimerTime(remaining);
                }, 10);
                
                timerRunning = true;
                startTimer.textContent = "Resume";
            }
            
            function displayTimerTime(time) {
                const totalSeconds = Math.floor(time / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                timerDisplay.textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            function pauseTimerFunc() {
                if (!timerRunning) return;
                
                clearInterval(timerInterval);
                timerRunning = false;
                startTimer.textContent = "Start";
            }
            
            function resetTimerFunc() {
                clearInterval(timerInterval);
                timerRunning = false;
                timerDisplay.textContent = "00:00:00";
                timerHours.value = "0";
                timerMinutes.value = "0";
                timerSeconds.value = "0";
                startTimer.textContent = "Start";
            }
        }
        
        // Scientific Calculator
        function loadScientificCalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-calculator"></i> Scientific Calculator</h3>
                    <div class="tsklytl-calculator-display" id="calcDisplay">0</div>
                    <div class="tsklytl-calculator-buttons">
                        <button class="clear">C</button>
                        <button class="operator">(</button>
                        <button class="operator">)</button>
                        <button class="operator">%</button>
                        
                        <button class="operator">sin</button>
                        <button class="operator">cos</button>
                        <button class="operator">tan</button>
                        <button class="operator">÷</button>
                        
                        <button class="operator">7</button>
                        <button class="operator">8</button>
                        <button class="operator">9</button>
                        <button class="operator">×</button>
                        
                        <button class="operator">4</button>
                        <button class="operator">5</button>
                        <button class="operator">6</button>
                        <button class="operator">-</button>
                        
                        <button class="operator">1</button>
                        <button class="operator">2</button>
                        <button class="operator">3</button>
                        <button class="operator">+</button>
                        
                        <button class="operator">0</button>
                        <button class="operator">.</button>
                        <button class="operator">π</button>
                        <button class="equals">=</button>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const display = document.getElementById('calcDisplay');
            const buttons = document.querySelectorAll('.tsklytl-calculator-buttons button');
            let currentInput = '0';
            let operation = null;
            let previousInput = '0';
            let resetDisplay = false;
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.textContent;
                    
                    if (button.classList.contains('clear')) {
                        currentInput = '0';
                        operation = null;
                        previousInput = '0';
                    } else if (button.classList.contains('operator')) {
                        handleOperator(value);
                    } else if (button.classList.contains('equals')) {
                        calculateResult();
                    } else {
                        handleNumber(value);
                    }
                    
                    display.textContent = currentInput;
                });
            });
            
            function handleNumber(value) {
                if (currentInput === '0' || resetDisplay) {
                    currentInput = value;
                    resetDisplay = false;
                } else {
                    currentInput += value;
                }
            }
            
            function handleOperator(op) {
                if (op === 'π') {
                    currentInput = Math.PI.toString();
                    return;
                }
                
                if (op === 'sin' || op === 'cos' || op === 'tan') {
                    const radians = parseFloat(currentInput) * (Math.PI / 180);
                    let result;
                    switch(op) {
                        case 'sin': result = Math.sin(radians); break;
                        case 'cos': result = Math.cos(radians); break;
                        case 'tan': result = Math.tan(radians); break;
                    }
                    currentInput = result.toString();
                    return;
                }
                
                previousInput = currentInput;
                operation = op;
                resetDisplay = true;
            }
            
            function calculateResult() {
                if (!operation) return;
                
                const prev = parseFloat(previousInput);
                const current = parseFloat(currentInput);
                let result;
                
                switch(operation) {
                    case '+': result = prev + current; break;
                    case '-': result = prev - current; break;
                    case '×': result = prev * current; break;
                    case '÷': result = prev / current; break;
                    case '%': result = prev % current; break;
                }
                
                currentInput = result.toString();
                operation = null;
                resetDisplay = true;
            }
        }
        
        // Date Calculator
        function loadDateCalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-calendar-alt"></i> Date Calculator</h3>
                    <div class="tsinput-group">
                        <label for="startDate">Start Date:</label>
                        <input type="date" id="startDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="endDate">End Date:</label>
                        <input type="date" id="endDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateDiff">Calculate Difference</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="dateResult"></div>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="addDays">Add/Subtract Days:</label>
                        <input type="number" id="addDays" value="0">
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateNewDate">Calculate New Date</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="newDateResult"></div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const startDate = document.getElementById('startDate');
            const endDate = document.getElementById('endDate');
            const calculateDiff = document.getElementById('calculateDiff');
            const dateResult = document.getElementById('dateResult');
            const addDays = document.getElementById('addDays');
            const calculateNewDate = document.getElementById('calculateNewDate');
            const newDateResult = document.getElementById('newDateResult');
            
            calculateDiff.addEventListener('click', calculateDateDifference);
            calculateNewDate.addEventListener('click', calculateNewDateFunc);
            
            function calculateDateDifference() {
                const start = new Date(startDate.value);
                const end = new Date(endDate.value);
                
                if (isNaN(start) || isNaN(end)) {
                    dateResult.textContent = "Please select valid dates";
                    return;
                }
                
                const diffTime = Math.abs(end - start);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                dateResult.textContent = `Difference: ${diffDays} days`;
            }
            
            function calculateNewDateFunc() {
                const start = new Date(startDate.value);
                const days = parseInt(addDays.value) || 0;
                
                if (isNaN(start)) {
                    newDateResult.textContent = "Please select a valid start date";
                    return;
                }
                
                start.setDate(start.getDate() + days);
                newDateResult.textContent = `New Date: ${start.toDateString()}`;
            }
            
            // Calculate initial difference
            calculateDateDifference();
        }
        
        // Tip Calculator
        function loadTipCalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-percentage"></i> Tip Calculator</h3>
                    <div class="tsinput-group">
                        <label for="billAmount">Bill Amount ($):</label>
                        <input type="number" id="billAmount" min="0" step="0.01" value="50.00">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="tipPercent">Tip Percentage:</label>
                        <input type="range" id="tipPercent" min="0" max="50" value="15">
                        <span id="tipPercentValue">15%</span>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="peopleCount">Number of People:</label>
                        <input type="number" id="peopleCount" min="1" value="1">
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateTip">Calculate Tip</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="tipAmount">Tip Amount: -</div>
                        <div id="totalAmount">Total Amount: -</div>
                        <div id="perPerson">Per Person: -</div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const billAmount = document.getElementById('billAmount');
            const tipPercent = document.getElementById('tipPercent');
            const tipPercentValue = document.getElementById('tipPercentValue');
            const peopleCount = document.getElementById('peopleCount');
            const calculateBtn = document.getElementById('calculateTip');
            const tipAmount = document.getElementById('tipAmount');
            const totalAmount = document.getElementById('totalAmount');
            const perPerson = document.getElementById('perPerson');
            
            tipPercent.addEventListener('input', () => {
                tipPercentValue.textContent = `${tipPercent.value}%`;
            });
            
            calculateBtn.addEventListener('click', calculateTip);
            
            function calculateTip() {
                const bill = parseFloat(billAmount.value);
                const tip = parseFloat(tipPercent.value);
                const people = parseInt(peopleCount.value);
                
                if (isNaN(bill) || isNaN(tip) || isNaN(people)) {
                    alert("Please enter valid numbers");
                    return;
                }
                
                const tipValue = bill * (tip / 100);
                const total = bill + tipValue;
                const perPersonValue = total / people;
                
                tipAmount.textContent = `Tip Amount: $${tipValue.toFixed(2)}`;
                totalAmount.textContent = `Total Amount: $${total.toFixed(2)}`;
                perPerson.textContent = `Per Person: $${perPersonValue.toFixed(2)}`;
            }
            
            // Calculate initial tip
            calculateTip();
        }
        
        // Currency Converter
        function loadCurrencyConverter() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-money-bill-wave"></i> Currency Converter</h3>
                    <div class="tsinput-group">
                        <label for="currencyAmount">Amount:</label>
                        <input type="number" id="currencyAmount" min="0" step="0.01" value="100">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="fromCurrency">From:</label>
                        <select id="fromCurrency">
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="GBP">British Pound (GBP)</option>
                            <option value="JPY">Japanese Yen (JPY)</option>
                        </select>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="toCurrency">To:</label>
                        <select id="toCurrency">
                            <option value="EUR">Euro (EUR)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="GBP">British Pound (GBP)</option>
                            <option value="JPY">Japanese Yen (JPY)</option>
                        </select>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="convertCurrency">Convert</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="currencyResult"></div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const currencyAmount = document.getElementById('currencyAmount');
            const fromCurrency = document.getElementById('fromCurrency');
            const toCurrency = document.getElementById('toCurrency');
            const convertlsbtn = document.getElementById('convertCurrency');
            const currencyResult = document.getElementById('currencyResult');
            
            // Fixed exchange rates for demo
            const exchangeRates = {
                USD: { EUR: 0.93, GBP: 0.80, JPY: 148.50, USD: 1 },
                EUR: { USD: 1.07, GBP: 0.86, JPY: 159.20, EUR: 1 },
                GBP: { USD: 1.25, EUR: 1.16, JPY: 185.40, GBP: 1 },
                JPY: { USD: 0.0067, EUR: 0.0063, GBP: 0.0054, JPY: 1 }
            };
            
            convertlsbtn.addEventListener('click', convertCurrency);
            
            function convertCurrency() {
                const amount = parseFloat(currencyAmount.value);
                const from = fromCurrency.value;
                const to = toCurrency.value;
                
                if (isNaN(amount)) {
                    alert("Please enter a valid amount");
                    return;
                }
                
                const rate = exchangeRates[from][to];
                const result = amount * rate;
                
                currencyResult.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
            }
            
            // Perform initial conversion
            convertCurrency();
        }
        
        // Joke Generator
        function loadJokeGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-joke"></i> Joke Generator</h3>
                    <p>Get a random joke to lighten your mood!</p>
                    
                    <div class="tsklytl-joke-display" id="jokeDisplay">
                        Click "Get Joke" to see a random joke
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="getJoke">Get Joke</button>
                    <button class="tlsbtn btn" id="copyJoke">Copy Joke</button>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const jokeDisplay = document.getElementById('jokeDisplay');
            const getJoke = document.getElementById('getJoke');
            const copyJoke = document.getElementById('copyJoke');
            
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything!",
                "What did one ocean say to the other ocean? Nothing, they just waved!",
                "Why did the scarecrow win an award? Because he was outstanding in his field!",
                "How do you organize a space party? You planet!",
                "Why don't skeletons fight each other? They don't have the guts!",
                "What do you call a fake noodle? An impasta!",
                "How does a penguin build its house? Igloos it together!",
                "Why did the bicycle fall over? Because it was two tired!",
                "What's orange and sounds like a parrot? A carrot!",
                "Why couldn't the leopard play hide and seek? Because he was always spotted!"
            ];
            
            getJoke.addEventListener('click', () => {
                const randomIndex = Math.floor(Math.random() * jokes.length);
                jokeDisplay.textContent = jokes[randomIndex];
            });
            
            copyJoke.addEventListener('click', () => {
                navigator.clipboard.writeText(jokeDisplay.textContent)
                    .then(() => {
                        const originalText = copyJoke.textContent;
                        copyJoke.textContent = 'Copied!';
                        setTimeout(() => {
                            copyJoke.textContent = originalText;
                        }, 2000);
                    });
            });
            
            // Load initial joke
            getJoke.click();
        }
        
        // Quote Generator
        function loadQuoteGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-quote-right"></i> Quote Generator</h3>
                    <p>Get inspired with a random quote!</p>
                    
                    <div class="tsklytl-joke-display" id="quoteDisplay">
                        Click "Get Quote" to see an inspirational quote
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="getQuote">Get Quote</button>
                    <button class="tlsbtn btn" id="copyQuote">Copy Quote</button>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const quoteDisplay = document.getElementById('quoteDisplay');
            const getQuote = document.getElementById('getQuote');
            const copyQuote = document.getElementById('copyQuote');
            
            const quotes = [
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
                "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
                "The way to get started is to quit talking and begin doing. - Walt Disney",
                "Life is what happens when you're busy making other plans. - John Lennon",
                "Spread love everywhere you go. - Mother Teresa",
                "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
                "Whoever is happy will make others happy too. - Anne Frank",
                "Do not go where the path may lead, go instead where there is no path and leave a trail. - Ralph Waldo Emerson",
                "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
                "Believe you can and you're halfway there. - Theodore Roosevelt",
                "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
                "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
                "It does not matter how slowly you go as long as you do not stop. - Confucius",
                "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
                "You miss 100% of the shots you don't take. - Wayne Gretzky",
                "The best way to predict the future is to invent it. - Alan Kay",
                "Dream big and dare to fail. - Norman Vaughan",
                "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
                "If you can dream it, you can do it. - Walt Disney",
                "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
                "Act as if what you do makes a difference. It does. - William James",
                "In the middle of every difficulty lies opportunity. - Albert Einstein",
                "Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman",
                "Don’t count the days, make the days count. - Muhammad Ali",
                "Opportunities don't happen. You create them. - Chris Grosser",
                "Everything you’ve ever wanted is on the other side of fear. - George Addair",
                "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
                "Failure will never overtake me if my determination to succeed is strong enough. - Og Mandino"
            ];
            
            getQuote.addEventListener('click', () => {
                const randomIndex = Math.floor(Math.random() * quotes.length);
                quoteDisplay.textContent = quotes[randomIndex];
            });
            
            copyQuote.addEventListener('click', () => {
                navigator.clipboard.writeText(quoteDisplay.textContent)
                    .then(() => {
                        const originalText = copyQuote.textContent;
                        copyQuote.textContent = 'Copied!';
                        setTimeout(() => {
                            copyQuote.textContent = originalText;
                        }, 2000);
                    });
            });
            
            // Load initial quote
            getQuote.click();
        }
        
        // Text Encoder/Decoder
        function loadTextEncoder() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-code"></i> Text Encoder/Decoder</h3>
                    <div class="tsinput-group">
                        <label for="textToEncode">Enter your text:</label>
                        <textarea id="textToEncode" rows="4" placeholder="Type or paste your text here..."></textarea>
                    </div>
                    
                    <div class="tsinput-group">
                        <label>Encoding Options:</label>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="tlsbtn btn" data-encode="base64">Base64 Encode</button>
                            <button class="tlsbtn btn" data-encode="base64decode">Base64 Decode</button>
                            <button class="tlsbtn btn" data-encode="url">URL Encode</button>
                            <button class="tlsbtn btn" data-encode="urldecode">URL Decode</button>
                        </div>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="encodedText">Result:</label>
                        <textarea id="encodedText" rows="4" readonly></textarea>
                    </div>
                    
                    <button class="tlsbtn btn" id="copyEncoded">Copy Result</button>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const textToEncode = document.getElementById('textToEncode');
            const encodedText = document.getElementById('encodedText');
            const encodeButtons = document.querySelectorAll('[data-encode]');
            const copyEncoded = document.getElementById('copyEncoded');
            
            encodeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const encodeType = button.dataset.encode;
                    let text = textToEncode.value;
                    let result = '';
                    
                    try {
                        switch(encodeType) {
                            case 'base64':
                                result = btoa(unescape(encodeURIComponent(text)));
                                break;
                            case 'base64decode':
                                result = decodeURIComponent(escape(atob(text)));
                                break;
                            case 'url':
                                result = encodeURIComponent(text);
                                break;
                            case 'urldecode':
                                result = decodeURIComponent(text);
                                break;
                        }
                    } catch (e) {
                        result = "Error: Invalid input for this operation";
                    }
                    
                    encodedText.value = result;
                });
            });
            
            copyEncoded.addEventListener('click', () => {
                navigator.clipboard.writeText(encodedText.value)
                    .then(() => {
                        const originalText = copyEncoded.textContent;
                        copyEncoded.textContent = 'Copied!';
                        setTimeout(() => {
                            copyEncoded.textContent = originalText;
                        }, 2000);
                    });
            });
        }
        
        // URL Encoder/Decoder
        function loadURLEncoder() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-link"></i> URL Encoder/Decoder</h3>
                    <div class="tsinput-group">
                        <label for="urlInput">Enter URL or text:</label>
                        <textarea id="urlInput" rows="3" placeholder="Type or paste URL/text here..."></textarea>
                    </div>
                    
                    <div class="tsinput-group">
                        <label>Operation:</label>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="tlsbtn btn" id="encodeURL">Encode URL</button>
                            <button class="tlsbtn btn" id="decodeURL">Decode URL</button>
                        </div>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="urlResult">Result:</label>
                        <textarea id="urlResult" rows="3" readonly></textarea>
                    </div>
                    
                    <button class="tlsbtn btn" id="copyURL">Copy Result</button>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const urlInput = document.getElementById('urlInput');
            const urlResult = document.getElementById('urlResult');
            const encodeURL = document.getElementById('encodeURL');
            const decodeURL = document.getElementById('decodeURL');
            const copyURL = document.getElementById('copyURL');
            
            encodeURL.addEventListener('click', () => {
                urlResult.value = encodeURIComponent(urlInput.value);
            });
            
            decodeURL.addEventListener('click', () => {
                try {
                    urlResult.value = decodeURIComponent(urlInput.value);
                } catch (e) {
                    urlResult.value = "Error: Invalid encoded URL";
                }
            });
            
            copyURL.addEventListener('click', () => {
                navigator.clipboard.writeText(urlResult.value)
                    .then(() => {
                        const originalText = copyURL.textContent;
                        copyURL.textContent = 'Copied!';
                        setTimeout(() => {
                            copyURL.textContent = originalText;
                        }, 2000);
                    });
            });
            
            // Initialize with encode
            encodeURL.click();
        }
        
        // Water Tracker
        function loadWaterTracker() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-glass-water"></i> Water Tracker</h3>
                    <p>Track your daily water intake. Each cup is approximately 250ml (8oz).</p>
                    
                    <div class="tsklytl-water-tracker">
                        <div class="tsklytl-water-cups" id="waterCups">
                            <!-- Cups will be generated here -->
                        </div>
                        
                        <button class="tlsbtn btn" id="addCup">Add Cup</button>
                        <button class="tlsbtn btn" id="resetWater">Reset</button>
                        
                        <div class="tsklytl-water-stats">
                            <div class="water-stat">
                                <div class="number" id="cupsCount">0</div>
                                <div>Cups Today</div>
                            </div>
                            <div class="water-stat">
                                <div class="number" id="waterAmount">0</div>
                                <div>ml Consumed</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const waterCups = document.getElementById('waterCups');
            const addCup = document.getElementById('addCup');
            const resetWater = document.getElementById('resetWater');
            const cupsCount = document.getElementById('cupsCount');
            const waterAmount = document.getElementById('waterAmount');
            
            let cups = 0;
            const cupSize = 250; // ml
            
            // Create cup elements
            for (let i = 0; i < 8; i++) {
                const cup = document.createElement('div');
                cup.classList.add('tsklytl-water-cup');
                cup.innerHTML = '<div class="tsklytl-water-fill"></div>';
                cup.dataset.index = i;
                waterCups.appendChild(cup);
            }
            
            addCup.addEventListener('click', () => {
                if (cups >= 8) return;
                cups++;
                updateWaterDisplay();
            });
            
            resetWater.addEventListener('click', () => {
                cups = 0;
                updateWaterDisplay();
            });
            
            function updateWaterDisplay() {
                cupsCount.textContent = cups;
                waterAmount.textContent = cups * cupSize;
                
                // Update cup visuals
                const allCups = document.querySelectorAll('.tsklytl-water-cup');
                allCups.forEach((cup, index) => {
                    if (index < cups) {
                        cup.classList.add('active');
                    } else {
                        cup.classList.remove('active');
                    }
                });
            }
            
            // Initialize
            updateWaterDisplay();
        }
        
        // Calorie Calculator
        function loadCalorieCalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-utensils"></i> Calorie Calculator</h3>
                    <div class="tsinput-group">
                        <label for="calorieGender">Gender:</label>
                        <select id="calorieGender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="calorieAge">Age (years):</label>
                        <input type="number" id="calorieAge" min="1" max="120" value="30">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="calorieHeight">Height (cm):</label>
                        <input type="number" id="calorieHeight" min="50" max="250" value="170">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="calorieWeight">Weight (kg):</label>
                        <input type="number" id="calorieWeight" min="20" max="300" value="70">
                    </div>
                    
                    <div class="tsinput-group">
                        <label for="calorieActivity">Activity Level:</label>
                        <select id="calorieActivity">
                            <option value="1.2">Sedentary (little or no exercise)</option>
                            <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                            <option value="1.55" selected>Moderately active (moderate exercise 3-5 days/week)</option>
                            <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                            <option value="1.9">Extra active (very hard exercise & physical job)</option>
                        </select>
                    </div>
                    
                    <div class="tsinput-group">
                        <label>Goal:</label>
                        <div style="display: flex; gap: 10px;">
                            <label><input type="radio" name="goal" value="loss" checked> Weight Loss</label>
                            <label><input type="radio" name="goal" value="maintain"> Maintain Weight</label>
                            <label><input type="radio" name="goal" value="gain"> Weight Gain</label>
                        </div>
                    </div>
                    
                    <button class="tlsbtn btn btn-block" id="calculateCalories">Calculate Calories</button>
                    
                    <div class="tsklytl-result-box">
                        <div id="calorieResult"></div>
                    </div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const calculateBtn = document.getElementById('calculateCalories');
            const calorieResult = document.getElementById('calorieResult');
            
            calculateBtn.addEventListener('click', calculateCalories);
            
            function calculateCalories() {
                const gender = document.getElementById('calorieGender').value;
                const age = parseFloat(document.getElementById('calorieAge').value);
                const height = parseFloat(document.getElementById('calorieHeight').value);
                const weight = parseFloat(document.getElementById('calorieWeight').value);
                const activity = parseFloat(document.getElementById('calorieActivity').value);
                const goal = document.querySelector('input[name="goal"]:checked').value;
                
                if (isNaN(age) || isNaN(height) || isNaN(weight)) {
                    alert("Please enter valid numbers");
                    return;
                }
                
                // Calculate BMR using Mifflin-St Jeor Equation
                let bmr;
                if (gender === 'male') {
                    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
                } else {
                    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
                }
                
                // Calculate TDEE (Total Daily Energy Expenditure)
                const tdee = bmr * activity;
                
                // Adjust for goal
                let calories;
                if (goal === 'loss') {
                    calories = tdee - 500; // 500 calorie deficit for weight loss
                } else if (goal === 'gain') {
                    calories = tdee + 500; // 500 calorie surplus for weight gain
                } else {
                    calories = tdee; // Maintain weight
                }
                
                calorieResult.innerHTML = `
                    <div>BMR (Basal Metabolic Rate): <strong>${bmr.toFixed(0)}</strong> calories/day</div>
                    <div>TDEE (Total Daily Energy Expenditure): <strong>${tdee.toFixed(0)}</strong> calories/day</div>
                    <div>Recommended Daily Calories: <strong>${calories.toFixed(0)}</strong> calories</div>
                `;
            }
            
            // Calculate initial calories
            calculateCalories();
        }
        
        // Color Palette Generator
        function loadColorPalette() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-palette"></i> Color Palette Generator</h3>
                    <p>Generate beautiful color palettes with complementary colors.</p>
                    
                    <button class="tlsbtn btn btn-block" id="generatePalette">Generate Palette</button>
                    
                    <div class="tsklytl-result-box" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 20px;">
                        <div class="palette-color" style="height: 100px; border-radius: var(--radius);"></div>
                        <div class="palette-color" style="height: 100px; border-radius: var(--radius);"></div>
                        <div class="palette-color" style="height: 100px; border-radius: var(--radius);"></div>
                        <div class="palette-color" style="height: 100px; border-radius: var(--radius);"></div>
                        <div class="palette-color" style="height: 100px; border-radius: var(--radius);"></div>
                    </div>
                    
                    <div class="tsklytl-result-box" id="paletteCodes" style="font-family: monospace; text-align: center;"></div>
                </div>
            `;
            
            tsklytlmodalBody.innerHTML = content;
            
            const generateBtn = document.getElementById('generatePalette');
            const paletteColors = document.querySelectorAll('.palette-color');
            const paletteCodes = document.getElementById('paletteCodes');
            
            generateBtn.addEventListener('click', generatePalette);
            
            function generatePalette() {
                const baseHue = Math.floor(Math.random() * 360);
                const colors = [];
                let codesHTML = '';
                
                for (let i = 0; i < 5; i++) {
                    const hue = (baseHue + i * 72) % 360;
                    const saturation = 70 + Math.floor(Math.random() * 30);
                    const lightness = 40 + Math.floor(Math.random() * 30);
                    
                    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                    colors.push(color);
                    
                    paletteColors[i].style.backgroundColor = color;
                    
                    // Convert to hex for display
                    const hex = hslToHex(hue, saturation, lightness);
                    codesHTML += `<div>${hex}</div>`;
                }
                
                paletteCodes.innerHTML = codesHTML;
            }
            
            function hslToHex(h, s, l) {
                l /= 100;
                const a = s * Math.min(l, 1 - l) / 100;
                const f = n => {
                    const k = (n + h / 30) % 12;
                    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                    return Math.round(255 * color).toString(16).padStart(2, '0');
                };
                return `#${f(0)}${f(8)}${f(4)}`;
            }
            
            // Generate initial palette
            generatePalette();
        }
        
        // Default tool (for others)
        function loadDefaultTool(tool) {
            const toolNames = {
                imageconverter: "Image Converter",
                masker: "Data Masker"
            };
            
            const name = toolNames[tool] || "This Tool";
            
            tsklytlmodalBody.innerHTML = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-tools"></i> ${name}</h3>
                    <p>This tool is currently under development. The functionality will be added in the next update.</p>
                    <p>In the meantime, you can try our other working tools!</p>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <div style="font-size: 5rem; margin-bottom: 20px;">🔧</div>
                        <p>Coming soon...</p>
                    </div>
                </div>
            `;
        }

        // Function to load image cropper tool
        function showAlert(msg, type) {
            const color = type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue';
            alert(`[${type.toUpperCase()}] ${msg}`);
        }

        function loadImageCropper() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-crop-alt"></i> Crop Your Image</h3>
                    <div class="input-group">
                        <label for="imageUpload">Upload Image:</label>
                        <input type="file" id="imageUpload" accept="image/*">
                    </div>
                    <div class="input-group">
                        <label for="cropWidth">Crop Width (px):</label>
                        <input type="number" id="cropWidth" value="400" min="50">
                    </div>
                    <div class="input-group">
                        <label for="cropHeight">Crop Height (px):</label>
                        <input type="number" id="cropHeight" value="300" min="50">
                    </div>
                    <div id="cropperContainer">
                        <img id="tsklytlimagePreview" src="" alt="Preview" style="max-height: 400px; display: none;">
                        <div class="tsklytl-crop-controls" style="display: none;">
                            <button class="tlsbtn btn" id="cropBtn"><i class="fas fa-crop"></i> Crop Image</button>
                            <button class="tlsbtn btn" id="downloadBtn"><i class="fas fa-download"></i> Download</button>
                        </div>
                    </div>
                    <div id="cropResult" class="tsklytl-result-box" style="display: none;">
                        <canvas id="croppedResult"></canvas>
                    </div>
                </div>
            `;
            tsklytlmodalBody.innerHTML = content;

            const imageUpload = document.getElementById('imageUpload');
            const cropWidthInput = document.getElementById('cropWidth');
            const cropHeightInput = document.getElementById('cropHeight');
            const tsklytlimagePreview = document.getElementById('tsklytlimagePreview');
            const cropperContainer = document.querySelector('.tsklytl-crop-controls');
            const cropResult = document.getElementById('cropResult');

            // Event listener for image upload
            imageUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function(event) {
                    tsklytlimagePreview.src = event.target.result;
                    tsklytlimagePreview.style.display = 'block';
                    cropperContainer.style.display = 'flex';
                    cropResult.style.display = 'none';

                    // Destroy previous cropper instance
                    if (cropper) cropper.destroy();

                    // Initialize Cropper.js with initial aspect ratio
                    updateCropperAspect(cropWidthInput.value, cropHeightInput.value);

                    // Add input listeners to update aspect ratio
                    cropWidthInput.addEventListener('input', () => updateCropperAspect(cropWidthInput.value, cropHeightInput.value));
                    cropHeightInput.addEventListener('input', () => updateCropperAspect(cropWidthInput.value, cropHeightInput.value));
                };
                reader.readAsDataURL(file);
            });

            // Update cropper aspect ratio
            function updateCropperAspect(width, height) {
                const aspectRatio = width / height;
                if (cropper) {
                    cropper.setAspectRatio(aspectRatio);
                } else {
                    cropper = new Cropper(tsklytlimagePreview, {
                        aspectRatio: aspectRatio,
                        viewMode: 1,
                        autoCropArea: 0.8,
                        responsive: true,
                        guides: true
                    });
                }
            }

            // Crop image
            document.getElementById('cropBtn').addEventListener('click', function() {
                if (!cropper) {
                    alert("Please upload an image first");
                    return;
                }
                const canvas = cropper.getCroppedCanvas({
                    width: parseInt(cropWidthInput.value),
                    height: parseInt(cropHeightInput.value)
                });

                const croppedCanvas = document.getElementById('croppedResult');
                const resultContainer = document.getElementById('cropResult');

                croppedCanvas.width = canvas.width;
                croppedCanvas.height = canvas.height;
                const ctx = croppedCanvas.getContext('2d');
                ctx.drawImage(canvas, 0, 0);

                resultContainer.style.display = 'block';
            });

            // Download cropped image
            document.getElementById('downloadBtn').addEventListener('click', function() {
                if (!cropper) {
                    alert("Please crop the image first");
                    return;
                }
                const canvas = cropper.getCroppedCanvas({
                    width: parseInt(cropWidthInput.value),
                    height: parseInt(cropHeightInput.value)
                });

                const link = document.createElement('a');
                link.download = 'cropped-image.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }

        function loadLoveCalculator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-heartbeat"></i> Love Calculator</h3>
                    <div class="input-group">
                        <label for="name1">Your Name:</label>
                        <input type="text" id="name1" placeholder="Enter your name">
                    </div>
                    <div class="input-group">
                        <label for="name2">Crush's Name:</label>
                        <input type="text" id="name2" placeholder="Enter crush's name">
                    </div>
                    <button class="tlsbtn btn btn-block" id="calculateLove">Calculate ❤️</button>
                    <div class="tsklytl-result-box" id="loveResult" style="text-align: center; min-height: 80px; margin-top: 20px; font-size: 1.5rem;">
                        Enter names and click calculate.
                    </div>
                </div>
            `;
            tsklytlmodalBody.innerHTML = content;

            const name1Input = document.getElementById('name1');
            const name2Input = document.getElementById('name2');
            const loveResult = document.getElementById('loveResult');
            const calculateLove = document.getElementById('calculateLove');

            calculateLove.addEventListener('click', () => {
                const name1 = name1Input.value.trim().toLowerCase();
                const name2 = name2Input.value.trim().toLowerCase();

                if (!name1 || !name2) {
                    loveResult.textContent = "Please enter both names!";
                    return;
                }

                // Simple algorithm for demo purposes
                const combined = (name1 + name2).replace(/[^a-z]/g, '');
                const sum = combined.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const lovePercent = Math.floor((sum % 101));

                let message = "";
                if (lovePercent > 80) {
                    message = "Perfect match! 💞";
                } else if (lovePercent > 60) {
                    message = "Great chemistry! 🥰";
                } else if (lovePercent > 40) {
                    message = "Could work out... maybe.";
                } else {
                    message = "Better luck next time 😢";
                }

                loveResult.innerHTML = `Compatibility: <strong>${lovePercent}%</strong><br>${message}`;
            });
        }
        function loadExcuseGenerator() {
            const excuses = [
                "My dog ate my homework.",
                "I was stuck in traffic due to a mysterious alien landing.",
                "My alarm clock broke... again.",
                "I caught my neighbor’s WiFi signal and couldn’t stop watching cat videos.",
                "I overslept because my dreams were better than reality."
            ];
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-umbrella-beach"></i> Make an Excuse</h3>
                    <div class="tsklytl-result-box" style="min-height: 100px; font-size: 1.2rem; text-align: center; display: flex; align-items: center; justify-content: center;">
                        Need an excuse? Just click the button!
                    </div>
                    <button class="tlsbtn btn btn-block" id="excuseBtn">Make Excuse</button>
                </div>
            `;
            tsklytlmodalBody.innerHTML = content;

            const resultBox = tsklytlmodalBody.querySelector('.tsklytl-result-box');
            const excuseBtn = document.getElementById('excuseBtn');

            excuseBtn.addEventListener('click', () => {
                const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
                resultBox.textContent = randomExcuse;
            });
        }
        function loadRoastGenerator() {
            const roasts = [
                "You're the reason why the gene pool needs a lifeguard.",
                "If I wanted to kill myself, I'd climb to your ego and jump to your IQ.",
                "You're like a software update: no one asked for it, everyone hates it.",
                "Your reflection must be jealous of your personality.",
                "I'd call you stupid, but that would be an insult to stupid people."
            ];
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-fire-alt"></i> Get Roasted</h3>
                    <div class="tsklytl-result-box" style="min-height: 100px; font-size: 1.2rem; text-align: center; display: flex; align-items: center; justify-content: center;">
                        Click the button below to get roasted!
                    </div>
                    <button class="tlsbtn btn btn-block" id="roastlsbtn">🔥 Roast Me</button>
                </div>
            `;
            tsklytlmodalBody.innerHTML = content;

            const resultBox = tsklytlmodalBody.querySelector('.tsklytl-result-box');
            const roastlsbtn = document.getElementById('roastlsbtn');

            roastlsbtn.addEventListener('click', () => {
                const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
                resultBox.textContent = randomRoast;
            });
        }
        function loadMemeGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-grin-tongue-squint"></i> Generate Your Meme</h3>
                    <div class="input-group">
                        <label for="topText">Top Text:</label>
                        <input type="text" id="topText" placeholder="Enter top text">
                    </div>
                    <div class="input-group">
                        <label for="bottomText">Bottom Text:</label>
                        <input type="text" id="bottomText" placeholder="Enter bottom text">
                    </div>
                    <button class="tlsbtn btn btn-block" id="generateMemeBtn">Generate Meme</button>
                    <div style="margin-top: 20px; text-align: center;">
                        <canvas id="memeCanvas" width="500" height="300" style="border: 2px solid var(--gray); display: none;"></canvas>
                        <img id="memeImage" src="" alt="Your Meme" style="max-width: 100%; display: none;">
                        <a id="downloadMemeLink" class="tlsbtn btn" style="display: none;" download="meme.png">Download Meme</a>
                    </div>
                </div>
            `;
            tsklytlmodalBody.innerHTML = content;

            const canvas = document.getElementById('memeCanvas');
            const ctx = canvas.getContext('2d');
            const memeImage = document.getElementById('memeImage');
            const topText = document.getElementById('topText');
            const bottomText = document.getElementById('bottomText');
            const generateBtn = document.getElementById('generateMemeBtn');
            const downloadLink = document.getElementById('downloadMemeLink');

            const memeTemplates = [
                "https://i.imgur.com/62LdXeT.jpg",  // Dog reacting
                "https://i.imgur.com/0NnJz4w.jpg",  // Distracted boyfriend
                "https://i.imgur.com/Vgv7Cv9.jpg",  // Drake meme
                "https://i.imgur.com/MeOKYQI.jpg",  // This is fine
                "https://i.imgur.com/p2F8jwK.jpg"   // Surprised Pikachu
            ];

            let selectedImage = "";

            function loadImage(url) {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.crossOrigin = "anonymous";
                        img.onload = () => resolve(img);
                        img.src = url;
                    });
                }

                async function drawMeme() {
                    if (!selectedImage) return;
                    const img = await loadImage(selectedImage);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    ctx.font = "bold 30px Impact";
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 2;
                    ctx.textAlign = "center";

                    ctx.fillText(topText.value.toUpperCase(), canvas.width / 2, 40);
                    ctx.strokeText(topText.value.toUpperCase(), canvas.width / 2, 40);

                    ctx.fillText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
                    ctx.strokeText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);

                    memeImage.src = canvas.toDataURL("image/png");
                    memeImage.style.display = "block";
                    downloadLink.href = memeImage.src;
                    downloadLink.style.display = "inline-block";
                }

                generateBtn.addEventListener('click', async () => {
                    selectedImage = memeTemplates[Math.floor(Math.random() * memeTemplates.length)];
                    drawMeme();
                });

                topText.addEventListener('input', drawMeme);
                bottomText.addEventListener('input', drawMeme);
        }
        function loadDataMasker() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-eye-slash"></i> Data Masking Tool</h3>
                    <div class="input-group mb-1">
                        <label for="dataType">Data Type:</label>
                        <select id="dataType">
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone Number</option>
                            <option value="custom">Custom Text</option>
                        </select>
                    </div>
                    <div class="input-group mb-1" id="customInputGroup" style="display: none;">
                        <label for="customInput">Enter Custom Text:</label>
                        <input type="text" id="customInput" placeholder="Type sensitive data here">
                    </div>
                    <div class="input-group mb-1">
                        <label for="maskChar">Mask Character:</label>
                        <input type="text" id="maskChar" maxlength="1" value="*" placeholder="e.g., *, #, X">
                    </div>
                    <div class="input-group mb-3">
                        <label for="preserveFormat">Preserve Format:</label>
                        <select id="preserveFormat">
                            <option value="none">No Formatting</option>
                            <option value="last4">Show Last 4 Characters</option>
                        </select>
                    </div>
                    <button class="tlsbtn btn btn-block" id="maskBtn">Apply Mask</button>
                    <div class="tsklytl-result-box" id="maskedResult">Masked result will appear here...</div>
                    <button class="tlsbtn btn" id="copyMasked"><i class="fas fa-copy"></i> Copy Result</button>
                </div>
            `;
            tsklytlmodalBody.innerHTML = content;

            const dataType = document.getElementById('dataType');
            const customInputGroup = document.getElementById('customInputGroup');
            const customInput = document.getElementById('customInput');
            const maskChar = document.getElementById('maskChar');
            const preserveFormat = document.getElementById('preserveFormat');
            const maskBtn = document.getElementById('maskBtn');
            const maskedResult = document.getElementById('maskedResult');
            const copyMasked = document.getElementById('copyMasked');

            // Show/hide custom input
            dataType.addEventListener('change', () => {
                if (dataType.value === 'custom') {
                    customInputGroup.style.display = 'block';
                } else {
                    customInputGroup.style.display = 'none';
                }
            });

            maskBtn.addEventListener('click', () => {
                let inputText = '';
                switch (dataType.value) {
                    case 'name':
                        inputText = 'John Doe';
                        break;
                    case 'email':
                        inputText = 'john.doe@example.com';
                        break;
                    case 'phone':
                        inputText = '+1234567890';
                        break;
                    case 'custom':
                        inputText = customInput.value.trim();
                        break;
                }

                if (!inputText) {
                    maskedResult.textContent = 'Please enter data to mask.';
                    return;
                }

                const char = maskChar.value || '*';
                const masked = maskData(inputText, char, preserveFormat.value);
                maskedResult.textContent = masked;
            });

            copyMasked.addEventListener('click', () => {
                navigator.clipboard.writeText(maskedResult.textContent).then(() => {
                    copyMasked.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyMasked.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
                    }, 2000);
                }).catch(() => {
                    alert("Failed to copy");
                });
            });

            function maskData(text, maskChar, format) {
                if (format === 'none') {
                    return maskChar.repeat(text.length);
                } else if (format === 'last4') {
                    if (text.length <= 4) return text;
                    const visiblePart = text.slice(-4);
                    const maskedPart = maskChar.repeat(text.length - 4);
                    return maskedPart + visiblePart;
                }
                return text; // fallback
            }

            // Optional: pre-fill sample on load
            maskBtn.click();
        }
        function loadEmojiGenerator() {
            const content = `
                <div class="tsklytl-tool-section">
                    <h3><i class="fas fa-smile-beam"></i> Random Emoji Generator</h3>
                    <div class="tsklytl-result-box" id="emojiDisplay" style="font-size: 4rem; text-align: center; min-height: 120px;">
                        😄
                    </div>
                    <div class="tsklytl-result-box" id="emojiMeaning" style="text-align: center; margin-top: 15px; font-size: 1.2rem;">
                        Smiling Face with Open Mouth
                    </div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="tlsbtn btn" id="generateEmojiBtn"><i class="fas fa-dice"></i> Generate New Emoji</button>
                        <button class="tlsbtn btn" id="copyEmojiBtn"><i class="fas fa-copy"></i> Copy Emoji</button>
                    </div>
                </div>
            `;
            tsklytlmodalBody.innerHTML = content;

            const emojiDisplay = document.getElementById('emojiDisplay');
            const emojiMeaning = document.getElementById('emojiMeaning');
            const generateEmojiBtn = document.getElementById('generateEmojiBtn');
            const copyEmojiBtn = document.getElementById('copyEmojiBtn');

            // List of emojis with meanings
            const emojis = [
                { tlsemoji: "😄", meaning: "Smiling Face with Open Mouth" },
                { tlsemoji: "😂", meaning: "Face with Tears of Joy" },
                { tlsemoji: "😎", meaning: "Smiling Face with Sunglasses" },
                { tlsemoji: "😢", meaning: "Crying Face" },
                { tlsemoji: "🔥", meaning: "Fire" },
                { tlsemoji: "👍", meaning: "Thumbs Up" },
                { tlsemoji: "🎉", meaning: "Party Popper" },
                { tlsemoji: "🍕", meaning: "Pizza" },
                { tlsemoji: "🐱", meaning: "Cat Face" },
                { tlsemoji: "🚀", meaning: "Rocket" },
                { tlsemoji: "🌈", meaning: "Rainbow" },
                { tlsemoji: "👻", meaning: "Ghost" },
                { tlsemoji: "🍔", meaning: "Hamburger" },
                { tlsemoji: "💥", meaning: "Collision" },
                { tlsemoji: "🍀", meaning: "Four Leaf Clover" },
                { tlsemoji: "❤️", meaning: "Red Heart" },
                { tlsemoji: "🤔", meaning: "Thinking Face" },
                { tlsemoji: "🥳", meaning: "Partying Face" },
                { tlsemoji: "🤖", meaning: "Robot Face" },
                { tlsemoji: "💡", meaning: "Light Bulb" }
            ];

            function getRandomEmoji() {
                const randomIndex = Math.floor(Math.random() * emojis.length);
                return emojis[randomIndex];
            }

            function displayRandomEmoji() {
                const { tlsemoji, meaning } = getRandomEmoji();
                emojiDisplay.textContent = tlsemoji;
                emojiMeaning.textContent = meaning;
            }

            generateEmojiBtn.addEventListener('click', displayRandomEmoji);

            copyEmojiBtn.addEventListener('click', () => {
                const emojiText = emojiDisplay.textContent;
                navigator.clipboard.writeText(emojiText).then(() => {
                    const originalText = copyEmojiBtn.innerHTML;
                    copyEmojiBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyEmojiBtn.innerHTML = originalText;
                    }, 2000);
                }).catch(() => {
                    alert("Failed to copy emoji");
                });
            });

            // Show initial emoji
            displayRandomEmoji();
        }