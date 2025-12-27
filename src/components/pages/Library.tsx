import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { mockLearners, mockSubjects } from '@/data/mock-data';
import { ReportExporter } from '@/components/features/ReportExporter';
import { formatDate, generateId } from '@/lib/utils';
import { useLibrary, useReports } from '@/store';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Eye, 
  Edit,
  Download,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  FileText,
  Save,
  X,
  Trash2,
  QrCode,
  Bookmark
} from 'lucide-react';

export function Library() {
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showReportExporter, setShowReportExporter] = useState(false);

  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [issueToReturn, setIssueToReturn] = useState<any>(null);

  const { books, issues, addBook, updateBook, deleteBook, issueBook, returnBook } = useLibrary();
  const { generateReport } = useReports();

  const mockBooks = [
    {
      id: generateId(),
      title: 'Grade 3 English Textbook',
      author: 'Kenya Institute of Curriculum Development',
      isbn: '978-9966-25-123-4',
      category: 'textbook',
      subject_id: 'sub-1',
      grade_level: 3,
      copies_total: 50,
      copies_available: 35,
      location: 'Section A, Shelf 3',
      status: 'active'
    },
    {
      id: generateId(),
      title: 'Mathematics Activity Book Grade 3',
      author: 'KICD',
      isbn: '978-9966-25-124-1',
      category: 'workbook',
      subject_id: 'sub-3',
      grade_level: 3,
      copies_total: 60,
      copies_available: 42,
      location: 'Section B, Shelf 1',
      status: 'active'
    },
    {
      id: generateId(),
      title: 'The Lion and the Mouse',
      author: 'Aesop',
      isbn: '978-0-123-45678-9',
      category: 'storybook',
      grade_level: 3,
      copies_total: 25,
      copies_available: 18,
      location: 'Section C, Shelf 2',
      status: 'active'
    }
  ];

  const mockIssues = [
    {
      id: generateId(),
      book_id: mockBooks[0].id,
      learner_id: 'learner-1',
      issued_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'issued',
      issued_by: 'librarian-1'
    },
    {
      id: generateId(),
      book_id: mockBooks[1].id,
      learner_id: 'learner-2',
      issued_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'overdue',
      issued_by: 'librarian-1'
    }
  ];

  const allBooks = books.length > 0 ? books : mockBooks;
  const allIssues = issues.length > 0 ? issues : mockIssues;

  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const getStudent = (studentId: string) => {
    return mockLearners.find(s => s.id === studentId);
  };

  const getBook = (bookId: string) => {
    return allBooks.find(b => b.id === bookId);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setShowBookForm(true);
  };

  const handleEditBook = (book: any) => {
    setSelectedBook(book);
    setShowBookForm(true);
  };

  const handleSaveBook = (bookData: any) => {
    if (selectedBook) {
      updateBook(selectedBook.id, bookData);
    } else {
      addBook(bookData);
    }
    setShowBookForm(false);
  };

  const handleDeleteBook = (book: any) => {
    if (confirm(`Delete "${book.title}"?`)) {
      deleteBook(book.id);
    }
  };

  const handleReturnBook = (issue: any) => {
    setIssueToReturn(issue);
    setShowReturnDialog(true);
  };

  const confirmReturn = () => {
    if (issueToReturn) {
      returnBook(issueToReturn.id);
      setShowReturnDialog(false);
      setIssueToReturn(null);
    }
  };

  const handleExportBookData = (book: any) => {
    generateReport({
      type: 'book_details',
      title: `${book.title} - Book Details`,
      data: book,
      format: 'pdf'
    });
  };

  const handleGenerateLibraryReport = () => {
    generateReport({
      type: 'library_inventory',
      title: 'Library Inventory Report',
      data: allBooks,
      format: 'xlsx'
    });
  };

  const BookCard = ({ book }: { book: any }) => {
    const availabilityRate = (book.copies_available / book.copies_total) * 100;
    const subject = mockSubjects.find(s => s.id === book.subject_id);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{book.title}</h3>
                <Badge variant="outline" className="capitalize">{book.category}</Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">ISBN</p>
                  <p className="text-sm font-mono">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Grade Level</p>
                  <p className="text-sm">Grade {book.grade_level}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Subject</p>
                  <p className="text-sm">{subject?.name || 'General'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm">{book.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Available:</span>
                <span className="font-semibold">{book.copies_available}/{book.copies_total}</span>
                <Progress value={availabilityRate} className="flex-1 max-w-20" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditBook(book)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowIssueForm(true)}>
                <Bookmark className="h-4 w-4 mr-1" />
                Issue
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExportBookData(book)}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const IssueCard = ({ issue }: { issue: any }) => {
    const book = getBook(issue.book_id);
    const student = getStudent(issue.learner_id);
    const isOverdue = new Date(issue.due_date) < new Date() && issue.status === 'issued';

    return (
      <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{book?.title}</h3>
                <Badge variant={isOverdue ? 'destructive' : issue.status === 'returned' ? 'default' : 'secondary'}>
                  {isOverdue ? 'Overdue' : issue.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">Issued to: {student?.name}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Issued Date</p>
                  <p>{formatDate(issue.issued_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {formatDate(issue.due_date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {issue.status === 'issued' && (
                <Button size="sm" onClick={() => handleReturnBook(issue)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Return
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BookForm = () => {
    const [formData, setFormData] = useState({
      title: selectedBook?.title || '',
      author: selectedBook?.author || '',
      isbn: selectedBook?.isbn || '',
      category: selectedBook?.category || 'textbook',
      subject_id: selectedBook?.subject_id || '',
      grade_level: selectedBook?.grade_level || 1,
      copies_total: selectedBook?.copies_total || 1,
      location: selectedBook?.location || '',
      status: selectedBook?.status || 'active'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveBook({ ...formData, copies_available: formData.copies_total });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="textbook">Textbook</SelectItem>
                <SelectItem value="workbook">Workbook</SelectItem>
                <SelectItem value="storybook">Story Book</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="magazine">Magazine</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Subject</Label>
            <Select value={formData.subject_id} onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">General</SelectItem>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="grade_level">Grade Level</Label>
            <Input
              id="grade_level"
              type="number"
              min="1"
              max="9"
              value={formData.grade_level}
              onChange={(e) => setFormData(prev => ({ ...prev, grade_level: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="copies_total">Total Copies</Label>
            <Input
              id="copies_total"
              type="number"
              min="1"
              value={formData.copies_total}
              onChange={(e) => setFormData(prev => ({ ...prev, copies_total: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Section A, Shelf 1"
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {selectedBook ? 'Update Book' : 'Add Book'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowBookForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  const IssueBookForm = () => {
    const [formData, setFormData] = useState({
      book_id: '',
      learner_id: '',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      issueBook(formData);
      setShowIssueForm(false);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Book</Label>
          <Select value={formData.book_id} onValueChange={(value) => setFormData(prev => ({ ...prev, book_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select book" />
            </SelectTrigger>
            <SelectContent>
              {allBooks.filter(b => b.copies_available > 0).map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title} ({book.copies_available} available)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Student</Label>
          <Select value={formData.learner_id} onValueChange={(value) => setFormData(prev => ({ ...prev, learner_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {mockLearners.filter(s => s.status === 'active').map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.admission_no})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            <Bookmark className="h-4 w-4 mr-2" />
            Issue Book
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowIssueForm(false)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-1">Manage books, resources, and student borrowing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {allBooks.length} Books
          </Badge>
          <Button onClick={handleAddBook}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
          <Button variant="outline" onClick={handleGenerateLibraryReport}>
            <FileText className="h-4 w-4 mr-2" />
            Library Report
          </Button>
          <Button onClick={() => setShowReportExporter(true)} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Library Reports
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-blue-600">{allBooks.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Books Issued</p>
                <p className="text-2xl font-bold text-green-600">{allIssues.filter(i => i.status === 'issued').length}</p>
              </div>
              <Bookmark className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{allIssues.filter(i => i.status === 'overdue').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization</p>
                <p className="text-2xl font-bold text-purple-600">78%</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="books">Books ({allBooks.length})</TabsTrigger>
          <TabsTrigger value="issues">Issues & Returns ({allIssues.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={() => setShowIssueForm(true)}>
              <Bookmark className="h-4 w-4 mr-2" />
              Issue Book
            </Button>
          </div>

          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {allIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Library Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Book Inventory', description: 'Complete catalog with availability' },
                    { name: 'Issue Register', description: 'All book issues and returns' },
                    { name: 'Overdue Books', description: 'Books past due date' },
                    { name: 'Popular Books', description: 'Most borrowed books analysis' },
                    { name: 'Student Reading Activity', description: 'Individual reading reports' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Generate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reading Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-blue-800">Average Books per Student</p>
                    <p className="text-2xl font-bold text-blue-600">3.2</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Most popular category:</span>
                      <span className="font-semibold">Story Books</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average reading time:</span>
                      <span className="font-semibold">12 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Return rate:</span>
                      <span className="font-semibold">96%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Book Form Dialog */}
      <Dialog open={showBookForm} onOpenChange={setShowBookForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          </DialogHeader>
          <BookForm />
        </DialogContent>
      </Dialog>

      {/* Issue Book Dialog */}
      <Dialog open={showIssueForm} onOpenChange={setShowIssueForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Book to Student</DialogTitle>
          </DialogHeader>
          <IssueBookForm />
        </DialogContent>
      </Dialog>

      {/* Report Exporter Dialog */}
      <Dialog open={showReportExporter} onOpenChange={setShowReportExporter}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Library Reports</DialogTitle>
          </DialogHeader>
          <ReportExporter 
            data={allBooks} 
            title="Library Reports" 
            type="privacy"
            onClose={() => setShowReportExporter(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Return Book Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Confirm return of book:</p>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium">{getBook(issueToReturn?.book_id)?.title}</p>
              <p className="text-sm text-gray-600">
                Issued to: {getStudent(issueToReturn?.learner_id)?.name}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={confirmReturn}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Return
              </Button>
              <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}