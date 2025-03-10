import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestions, setAnswer, submitDiagnostic } from '../redux/slices/diagnosticSlice';

const Diagnostic = () => {
    const dispatch = useDispatch();
    const { questions, loading, error, submissionStatus, responses } = useSelector((state) => state.diagnostic);
    const userId = useSelector((state) => state.auth.userId); // Récupérer l'ID utilisateur depuis Redux

    useEffect(() => {
        dispatch(fetchQuestions()); // Charger les questions au montage
    }, [dispatch]);

    const handleAnswerChange = (questionId, answer) => {
        dispatch(setAnswer({ questionId, answer }));
    };

    const handleSubmit = () => {
        if (!userId) {
            alert("Utilisateur non authentifié. Veuillez vous connecter.");
            return;
        }

        const data = { userId, responses };
        dispatch(submitDiagnostic(data)); // Envoyer les réponses avec l'ID utilisateur
    };

    if (loading) return <div>Chargement des questions...</div>;
    if (error) return <div>Erreur : {error}</div>;

    return (
        <div>
            <h2>Questionnaire de Diagnostic</h2>
            {questions.map((question) => (
                <div key={question._id}>
                    <p>{question.text}</p>
                    {question.options ? (
                        question.options.map((option, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    id={`question-${question._id}-option-${index}`}
                                    name={question._id}
                                    value={option}
                                    onChange={() => handleAnswerChange(question._id, option)}
                                />
                                <label htmlFor={`question-${question._id}-option-${index}`}>{option}</label>
                            </div>
                        ))
                    ) : (
                        <input
                            type="text"
                            placeholder="Votre réponse"
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        />
                    )}
                </div>
            ))}
            <button onClick={handleSubmit}>
                {submissionStatus === 'success' ? 'Diagnostic soumis avec succès' : 'Soumettre le diagnostic'}
            </button>
            {submissionStatus === 'failed' && <div>Erreur lors de la soumission du diagnostic</div>}
        </div>
    );
};

export default Diagnostic;
