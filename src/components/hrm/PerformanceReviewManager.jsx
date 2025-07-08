// FILE: src/components/hrm/PerformanceReviewManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import { useAuthStore } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Save } from 'lucide-react';
import Card from '@/components/ui/Card';
import NeumorphismSelect from '@/components/ui/NeumorphismSelect';
import NeumorphismButton from '@/components/ui/NeumorphismButton';

export default function PerformanceReviewManager() {
  const { user } = useAuthStore();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [pastReviews, setPastReviews] = useState([]);
  
  const [managerFeedback, setManagerFeedback] = useState('');
  const [employeeAssessment, setEmployeeAssessment] = useState('');
  const [goals, setGoals] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const staffUnsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setStaffList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => staffUnsub();
  }, []);

  useEffect(() => {
    if (!selectedStaffId) {
      setPastReviews([]);
      return;
    }
    
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('staffId', '==', selectedStaffId)
    );

    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      reviewList.sort((a, b) => b.reviewDate.toDate() - a.reviewDate.toDate());
      setPastReviews(reviewList);
    });
    return () => unsubscribe();
  }, [selectedStaffId]);

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !managerFeedback) {
      alert("Please select a staff member and provide manager feedback.");
      return;
    }
    setIsLoading(true);
    try {
      const selectedStaff = staffList.find(s => s.id === selectedStaffId);
      await addDoc(collection(db, 'reviews'), {
        staffId: selectedStaffId,
        staffName: selectedStaff.name,
        reviewerId: user.uid,
        reviewerName: user.name,
        reviewDate: new Date(),
        managerFeedback,
        employeeAssessment,
        goals,
      });
      alert("Performance review saved successfully!");
      setManagerFeedback('');
      setEmployeeAssessment('');
      setGoals('');
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const NeumorphismTextarea = (props) => (
    <textarea {...props} className="w-full my-1 p-3 bg-neo-bg rounded-lg shadow-neo-inset focus:outline-none text-sm" />
  );

  return (
    <Card title="Performance Reviews">
      <div className="mb-4">
        <label htmlFor="staffSelectReview" className="block text-sm font-medium text-gray-700 mb-1">Select Staff to Review</label>
        <NeumorphismSelect 
          id="staffSelectReview" 
          value={selectedStaffId} 
          onChange={(e) => setSelectedStaffId(e.target.value)}
        >
          <option value="">-- Select a staff member --</option>
          {staffList.map(staff => <option key={staff.id} value={staff.id}>{staff.name}</option>)}
        </NeumorphismSelect>
      </div>

      {selectedStaffId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSaveReview} className="space-y-4">
            <h3 className="font-semibold text-gray-700">Create New Review</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Manager's Feedback</label>
              <NeumorphismTextarea value={managerFeedback} onChange={(e) => setManagerFeedback(e.target.value)} rows="4" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee's Self-Assessment</label>
              <NeumorphismTextarea value={employeeAssessment} onChange={(e) => setEmployeeAssessment(e.target.value)} rows="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Goals for Next Period</label>
              <NeumorphismTextarea value={goals} onChange={(e) => setGoals(e.target.value)} rows="3" />
            </div>
            <NeumorphismButton type="submit" disabled={isLoading}>
              <Save className="w-5 h-5" />
              <span>{isLoading ? 'Saving...' : 'Save Review'}</span>
            </NeumorphismButton>
          </form>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Review History</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {pastReviews.length > 0 ? pastReviews.map(review => (
                <div key={review.id} className="p-4 border border-neo-dark/20 rounded-lg">
                  <p className="font-bold text-sm">Review Date: {formatDate(review.reviewDate.toDate())}</p>
                  <p className="text-xs text-gray-500">Reviewed by: {review.reviewerName}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-primary">View Details</summary>
                    <div className="mt-2 text-xs text-gray-600 space-y-2">
                      <p><span className="font-semibold">Feedback:</span> {review.managerFeedback}</p>
                      <p><span className="font-semibold">Self-Assessment:</span> {review.employeeAssessment}</p>
                      <p><span className="font-semibold">Goals:</span> {review.goals}</p>
                    </div>
                  </details>
                </div>
              )) : <p className="text-sm text-gray-500">No past reviews for this employee.</p>}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
