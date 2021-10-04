if(localStorage.getItem('lang') == 'en'){
    const $des = document.getElementById('des');
    const $des2 = document.querySelector('.des2');
    const $firstTitle = document.querySelector('.first-title');
    const $firstStep = document.querySelector('.first-step');

    const $secondTitle = document.querySelector('.second-title');
    const $secondStep = document.querySelector('.second-step');

    const $thirdTitle = document.querySelector('.third-title');
    const $thirdStep = document.querySelector('.third-step');

    const $fourthTitle = document.querySelector('.fourth-title');
    const $fourthStep = document.querySelector('.fourth-step');
    
    const $quiz = document.getElementById('quiz');
    const $quizDes = document.querySelector('.quiz-des');

    const $h3Com = document.querySelector('.h3com');
    const $h3Des = document.querySelector('.h3des');

    const $h3ven = document.querySelector('.h3ven');
    const $h3vendes = document.querySelector('.h3vendes');

    const $h4ra = document.querySelector('.h4ra');
    const $h4rades = document.querySelector('.h4rades');

    const $h4in = document.querySelector('.h4in');
    const $h4indes = document.querySelector('.h4indes');

    const $h4ver = document.querySelector('.h4ver');
    const $h4verdes = document.querySelector('.h4verdes');

    $des.textContent = 'How to play';
    $des2.innerHTML = `
    The <strong>game</strong> consist in made your "quiz" / questions about you, this questions you can share
    and play with your friends
    `;

    $firstTitle.textContent = '1 | Enter your name'
    $firstStep.textContent = 'First you have to enter your name, this will show in the Answer Section, so your friends can identify you in the quiz'
    
    $secondTitle.textContent = '2 | Select one type of Quiz';
    $secondStep.innerHTML = `
    After of enter your name, will show two options that you can select:
    <div class="list__type-quest">
        <ul>
            <li id="quiz-1"> Default Quiz</li>
            <li id="quiz-2"> Personalized quiz for you</li>
        </ul>
    </div>
    `
    
    $thirdTitle.textContent = '3 | Complete any fields text'
    $thirdStep.innerHTML = `
        If you choosed a sugered Quiz, all is done, you only have to select a answer for each Question
        <br><br>
        Otherwise if you chose a personalized Quiz
        you will have the freedom to write your question and your possible answers, when everything is done you can choose the correct answers with the "check" icon
        which is positioned at the end of each field
    `
    $fourthTitle.textContent = '4 | Share your Quiz'
    $fourthStep.textContent = 'To last create your quiz and funny!, share the link in your social networks'

    $quiz.textContent = 'What is a Quiz?'
    $quizDes.innerHTML = `
        A questionnaire is a tool used to assess and measure a person's <strong> knowledge </strong> on a specific topic.
        It can even be used to determine certain aspects of <strong> a person's character </strong>. It differs from exams or quizzes
        because it is less formal and tends to be more interesting and dynamic. Another feature of the questionnaires is the use of specific responses
        to qualify. In some cases, they may have a time limit to answer them. However, the most attractive aspect of the test is the
        <strong> immediacy of results. </strong>
    `

    $h3Com.textContent = "Isn't a quiz the same as an exam?"
    $h3Des.innerHTML = `
    The answer is no. The exams are much more formal and may require more <strong> preparation </strong> on the part of the students, while the exams are used in a timely manner and generally not as long.
    It is not very formal and does not create the terrible impression in front of young people as <strong> exams or other assessment methods. </strong>
    `

    $h3ven.textContent = 'Advantages of a Quiz';
    $h3vendes.textContent = "Let's see below some advantages that we have when applying a quiz:"

    $h4ra.textContent = 'Fast:'
    $h4rades.textContent = 'We can use it quickly without doing a lot of preparatory work, unlike the exam that requires a larger protocol.'

    $h4in.textContent = 'Informal:';
    $h4indes.textContent = 'It is a less formal evaluation, placing a different perception on the student and encouraging him to pass as long as he has the knowledge.'

    $h4ver.textContent = 'Versatile:'
    $h4verdes.innerHTML = `
    One of the great advantages of a quiz is that it can be used in multiple ways. We can combine it with different elements to give it a <strong> special </strong> touch and stimulate the <strong> intelligence and imagination </strong> of those who are sitting at their desks.
    `
    document.querySelector('.description').textContent = 'Find out who knows more about you';
}