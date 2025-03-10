import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, submitDiagnostic, setAnswer } from '../../redux/slices/diagnosticSlice';
import './Questionnaire.css';

const Questionnaire = () => {
    const dispatch = useDispatch();
    const questions = useSelector((state) => state.diagnostic.questions);
    const loading = useSelector((state) => state.diagnostic.loading);
    const submissionStatus = useSelector((state) => state.diagnostic.submissionStatus);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        dispatch(fetchQuestions());
    }, [dispatch]);

    useEffect(() => {
        if (questions.length > 0) {
            setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
        }
    }, [currentQuestionIndex, questions.length]);

    const handleAnswerChange = (e) => {
        const answer = e.target.value;
        const questionId = questions[currentQuestionIndex]._id;
        dispatch(setAnswer({ questionId, answer }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            dispatch(submitDiagnostic());
        }
    };

    if (loading) {
        return <div>Chargement des questions...</div>;
    }

    if (submissionStatus === 'success') {
        return <div>Diagnostic soumis avec succès !</div>;
    }

    if (submissionStatus === 'failed') {
        return <div>Échec de la soumission du diagnostic. Veuillez réessayer.</div>;
    }

    return (
        <div className="questionnaire-container">
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            {questions.length > 0 && (
                <div className="question-container">
                    <h2>Question {currentQuestionIndex + 1}/{questions.length}</h2>
                    <p>{questions[currentQuestionIndex].text}</p>
                    <input
                        type="text"
                        onChange={handleAnswerChange}
                        placeholder="Votre réponse"
                    />
                    <button onClick={handleNextQuestion}>
                        {currentQuestionIndex < questions.length - 1 ? 'Suivant' : 'Soumettre'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Questionnaire;