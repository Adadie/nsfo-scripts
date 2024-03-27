import axios from 'axios';
import { API_URL } from './config';
import { data } from './data';

const populateDB = async () => {
  try {
    console.log('starting ....');
    const surveyData = {
      title: data.title,
      description: data.description,
      year: data.year,
      valid: data.valid,
    };

    const surveyResponse = await axios.post(`${API_URL}/surveys`, surveyData);
    const surveyId = surveyResponse.data.data.id;
    console.log('survey id>>>>>>>>>>>>>>>>>>>>>>', surveyId);

    for (const section of data.sections) {
      const sectionData = {
        title: section.title,
        position: section.position,
        survey: surveyId,
        canSkip: section.canSkip,
      };

      const sectionResponse = await axios.post(`${API_URL}/sections`, sectionData);
      const sectionId = sectionResponse.data.data.id;
      console.log('sectionId>>>>>>>>>>>>>>>>>>>>>>>', sectionId);
      const surveySectionId = sectionResponse.data.data.id;
      console.log('Section >>>>>>>>>>>>>>>>>>>', sectionId);

      for (const subSection of section.subSections) {
        const subSectionData = {
          title: subSection.title,
          position: subSection.position,
          section: sectionId,
        };

        const subSectionResponse = await axios.post(`${API_URL}/sub-sections`, subSectionData);
        const subSectionId = subSectionResponse.data.data.id;
        console.log('SubSection >>>>>>>>>>>>>>>>>>>', subSectionId);

        for (const question of subSection.questions) {
          const questionData = {
            text: question.text,
            type: question.type,
            htmlElement: question.htmlElement,
            inputIcon: question.inputIcon,
            answerDataType: question.answerDataType,
            canSkip: question.canSkip ?? false,
            graded: question.graded,
            position: question.position,
            maximumScore: question.maximumScore,
            surveyId: surveyId,
            subSectionId: subSectionId,
            sectionId: sectionResponse.data.data.id,
          };

          const questionResponse = await axios.post(`${API_URL}/questions`, questionData);
          const questionId = questionResponse.data.data.id;
          console.log('Question >>>>>>>>>>>>>>>>>>>', questionId);

          if ((question.type === 'MULTIPLE_CHOICE' || question.type === 'MULTIPLE_CHOICE') && question.choices) {
            for (const choice of question.choices) {
              const choiceData = {
                text: choice.text,
                score: choice.score,
                questionId: questionId,
              };

              await axios.post(`${API_URL}/choices`, choiceData);
            }
          }
        }
      }
    }

    console.log('ending ....');
  } catch (error) {
    console.error('Error caught ()', error);
  }
};

populateDB();
