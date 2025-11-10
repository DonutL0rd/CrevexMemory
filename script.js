 let allSentences = [];
        let selectedSentences = [];
        let studyText = '';

        function closeWelcome() {
            document.getElementById('welcomeModal').style.display = 'none';
        }

        function updateSteps(active) {
            document.getElementById('step1').classList.remove('active', 'completed');
            document.getElementById('step2').classList.remove('active', 'completed');
            document.getElementById('step3').classList.remove('active', 'completed');

            if (active === 1) {
                document.getElementById('step1').classList.add('active');
            } else if (active === 2) {
                document.getElementById('step1').classList.add('completed');
                document.getElementById('step2').classList.add('active');
            } else if (active === 3) {
                document.getElementById('step1').classList.add('completed');
                document.getElementById('step2').classList.add('completed');
                document.getElementById('step3').classList.add('active');
            }
        }

        updateSteps(1);

        function splitSentences() {
            const text = document.getElementById('originalText').value.trim();
            if (!text) {
                alert('Please enter some text first!');
                return;
            }

            allSentences = text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [text];
            allSentences = allSentences.map(s => s.trim()).filter(s => s.length > 0);

            displaySentences();
            document.getElementById('sentenceSection').classList.remove('hidden');
            document.getElementById('sentenceSection').classList.add('fade-in');
            document.getElementById('previewSection').classList.add('hidden');
            updateSteps(2);
        }

        function displaySentences() {
            const list = document.getElementById('sentenceList');
            list.innerHTML = '';

            if (allSentences.length === 0) {
                list.innerHTML = '<div class="empty-state">No sentences found. Try pasting some text above.</div>';
                return;
            }

            allSentences.forEach((sentence, index) => {
                const item = document.createElement('div');
                item.className = 'sentence-item';
                item.onclick = () => toggleSentence(index);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'sentence-checkbox';
                checkbox.id = `sentence-${index}`;
                checkbox.checked = false;

                const number = document.createElement('span');
                number.className = 'sentence-number';
                number.textContent = index + 1;

                const text = document.createElement('div');
                text.className = 'sentence-text';
                text.textContent = sentence;

                item.appendChild(checkbox);
                item.appendChild(number);
                item.appendChild(text);
                list.appendChild(item);
            });
        }

        function toggleSentence(index) {
            const checkbox = document.getElementById(`sentence-${index}`);
            const item = checkbox.closest('.sentence-item');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
            
            updateSelection();
        }

        function updateSelection() {
            selectedSentences = [];
            allSentences.forEach((sentence, index) => {
                const checkbox = document.getElementById(`sentence-${index}`);
                
                if (checkbox.checked) {
                    selectedSentences.push(index);
                }
            });

            document.getElementById('selectedCount').textContent = `${selectedSentences.length} selected`;

            if (selectedSentences.length > 0) {
                const preview = selectedSentences.map(i => allSentences[i]).join(' ');
                document.getElementById('selectedPreview').textContent = preview;
                document.getElementById('previewSection').classList.remove('hidden');
                document.getElementById('previewSection').classList.add('fade-in');
            } else {
                document.getElementById('previewSection').classList.add('hidden');
            }
        }

        function selectAll() {
            allSentences.forEach((_, index) => {
                const checkbox = document.getElementById(`sentence-${index}`);
                const item = checkbox.closest('.sentence-item');
                checkbox.checked = true;
                item.classList.add('selected');
            });
            updateSelection();
        }

        function deselectAll() {
            allSentences.forEach((_, index) => {
                const checkbox = document.getElementById(`sentence-${index}`);
                const item = checkbox.closest('.sentence-item');
                checkbox.checked = false;
                item.classList.remove('selected');
            });
            updateSelection();
        }

        function startTraining() {
            if (selectedSentences.length === 0) {
                alert('Please select at least one sentence to study!');
                return;
            }

            studyText = selectedSentences.map(i => allSentences[i]).join(' ').trim();

            document.getElementById('setupMode').classList.add('hidden');
            document.getElementById('trainingMode').classList.remove('hidden');
            document.getElementById('trainingMode').classList.add('fade-in');
            document.getElementById('userAnswer').value = '';
            document.getElementById('comparisonSection').classList.add('hidden');
            document.getElementById('userAnswer').focus();
            updateSteps(3);
        }

        function checkAnswer() {
            const userAnswer = document.getElementById('userAnswer').value.trim();
            if (!userAnswer) {
                alert('Please type your answer first!');
                return;
            }

            const original = normalizeText(studyText);
            const user = normalizeText(userAnswer);

            const diff = computeDiff(original, user);
            displayDiff(diff);

            document.getElementById('comparisonSection').classList.remove('hidden');
            document.getElementById('comparisonSection').classList.add('fade-in');
        }

        function normalizeText(text) {
            return text.trim().split(/\s+/);
        }

        function computeDiff(original, user) {
            const result = [];
            let correctCount = 0;

            const maxLen = Math.max(original.length, user.length);
            
            for (let i = 0; i < maxLen; i++) {
                if (i >= original.length) {
                    result.push({ word: user[i], type: 'extra' });
                } else if (i >= user.length) {
                    result.push({ word: original[i], type: 'missing', expected: original[i] });
                } else if (original[i].toLowerCase() === user[i].toLowerCase()) {
                    result.push({ word: user[i], type: 'correct', expected: original[i] });
                    correctCount++;
                } else {
                    result.push({ word: user[i], type: 'incorrect', expected: original[i] });
                }
            }

            const accuracy = original.length > 0 ? Math.round((correctCount / original.length) * 100) : 0;

            document.getElementById('accuracy').textContent = accuracy + '%';
            document.getElementById('correctWords').textContent = correctCount;
            document.getElementById('totalWords').textContent = original.length;

            return result;
        }

        function displayDiff(diff) {
            const originalContainer = document.getElementById('originalDisplay');
            const userContainer = document.getElementById('userDisplay');
            originalContainer.innerHTML = '';
            userContainer.innerHTML = '';

            diff.forEach(item => {
                // Display in original text container
                const originalSpan = document.createElement('span');
                
                if (item.type === 'correct') {
                    originalSpan.className = 'correct';
                    originalSpan.textContent = item.expected || item.word;
                    originalSpan.title = 'You got this correct!';
                } else if (item.type === 'incorrect') {
                    originalSpan.className = 'incorrect';
                    originalSpan.textContent = item.expected;
                    originalSpan.title = `You wrote: ${item.word}`;
                } else if (item.type === 'missing') {
                    originalSpan.className = 'missing';
                    originalSpan.textContent = item.word;
                    originalSpan.title = 'You missed this word';
                } else if (item.type === 'extra') {
                    // Don't show extra words in original text
                }
                
                if (item.type !== 'extra') {
                    originalContainer.appendChild(originalSpan);
                    originalContainer.appendChild(document.createTextNode(' '));
                }

                // Display in user's answer container
                if (item.type !== 'missing') {
                    const userSpan = document.createElement('span');
                    
                    if (item.type === 'correct') {
                        userSpan.className = 'correct';
                        userSpan.textContent = item.word;
                    } else if (item.type === 'incorrect') {
                        userSpan.className = 'incorrect';
                        userSpan.textContent = item.word;
                        userSpan.title = `Should be: ${item.expected}`;
                    } else if (item.type === 'extra') {
                        userSpan.className = 'incorrect';
                        userSpan.textContent = item.word;
                        userSpan.title = 'Extra word - not in original';
                    }
                    
                    userContainer.appendChild(userSpan);
                    userContainer.appendChild(document.createTextNode(' '));
                }
            });
        }

        function resetTraining() {
            document.getElementById('setupMode').classList.remove('hidden');
            document.getElementById('trainingMode').classList.add('hidden');
            document.getElementById('comparisonSection').classList.add('hidden');
            updateSteps(1);
        }