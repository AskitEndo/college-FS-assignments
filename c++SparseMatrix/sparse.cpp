#include <iostream>
using namespace std;

struct Element {
    int row;
    int col;
    double value;
    bool active;  // indicates if this element is in use

    Element() : row(-1), col(-1), value(0), active(false) {}
};

class SparseMatrix {
private:
    Element* elements;
    size_t maxSize;
    size_t itemCount;
    const double LOAD_FACTOR = 0.7;

    // Hash function for row/col coordinates
    size_t hashPosition(int row, int col) const {
        size_t hash = (size_t)row * 73856093 ^ (size_t)col * 19349663;
        return hash % maxSize;
    }

    // Grow table when it gets too full
    void growTable() {
        size_t oldSize = maxSize;
        maxSize *= 2;
        Element* oldElements = elements;

        // Create new table with twice the capacity
        elements = new Element[maxSize];
        itemCount = 0;

        // Reinsert all active elements
        for (size_t i = 0; i < oldSize; i++) {
            if (oldElements[i].active) {
                set(oldElements[i].row, oldElements[i].col, oldElements[i].value);
            }
        }
        delete[] oldElements;
    }

public:
    SparseMatrix(size_t initialSize = 8) {
        maxSize = initialSize;
        itemCount = 0;
        elements = new Element[maxSize];
    }

    ~SparseMatrix() {
        delete[] elements;
    }
    
    // Copy constructor
    SparseMatrix(const SparseMatrix& other) {
        maxSize = other.maxSize;
        itemCount = other.itemCount;
        elements = new Element[maxSize];
        
        // Copy all elements
        for (size_t i = 0; i < maxSize; i++) {
            elements[i] = other.elements[i];
        }
    }
    
    // Assignment operator
    SparseMatrix& operator=(const SparseMatrix& other) {
        if (this != &other) {
            delete[] elements;
            
            maxSize = other.maxSize;
            itemCount = other.itemCount;
            elements = new Element[maxSize];
            
            for (size_t i = 0; i < maxSize; i++) {
                elements[i] = other.elements[i];
            }
        }
        return *this;
    }

    void set(int row, int col, double value) {
        // Handle zero case - remove the element
        if (value == 0.0) {
            size_t pos = hashPosition(row, col);
            size_t start = pos;
            
            // Find the element using linear probing
            while (elements[pos].active) {
                if (elements[pos].row == row && elements[pos].col == col) {
                    elements[pos].active = false;
                    itemCount--;
                    return;
                }
                pos = (pos + 1) % maxSize;
                if (pos == start) break; // Full table check
            }
            return;
        }

        // Grow the table if it's getting too full
        if ((double)(itemCount + 1) / maxSize > LOAD_FACTOR) {
            growTable();
        }

        // Find position to insert or update
        size_t pos = hashPosition(row, col);
        while (elements[pos].active) {
            // Update existing entry
            if (elements[pos].row == row && elements[pos].col == col) {
                elements[pos].value = value;
                return;
            }
            pos = (pos + 1) % maxSize;
        }

        // Insert new element
        elements[pos].row = row;
        elements[pos].col = col;
        elements[pos].value = value;
        elements[pos].active = true;
        itemCount++;
    }

    double get(int row, int col) const {
        size_t pos = hashPosition(row, col);
        size_t start = pos;
        
        while (elements[pos].active) {
            if (elements[pos].row == row && elements[pos].col == col) {
                return elements[pos].value;
            }
            pos = (pos + 1) % maxSize;
            if (pos == start) break; // Prevent infinite loop
        }
        return 0.0; // Default for sparse matrices
    }

    size_t size() const {
        return itemCount;
    }

    // Iterator for non-zero elements
    class Iterator {
    private:
        const SparseMatrix& matrix;
        size_t current;

        void findNext() {
            while (current < matrix.maxSize && !matrix.elements[current].active)
                current++;
        }

    public:
        Iterator(const SparseMatrix& m, size_t start) : matrix(m), current(start) {
            findNext();
        }

        bool operator!=(const Iterator& other) const {
            return current != other.current;
        }

        Iterator& operator++() {
            current++;
            findNext();
            return *this;
        }

        const Element& operator*() const {
            return matrix.elements[current];
        }
    };

    Iterator begin() const {
        return Iterator(*this, 0);
    }

    Iterator end() const {
        return Iterator(*this, maxSize);
    }

    // Get transpose of this matrix
    SparseMatrix transpose() const {
        SparseMatrix result(maxSize);
        
        for (size_t i = 0; i < maxSize; i++) {
            if (elements[i].active) {
                result.set(elements[i].col, elements[i].row, elements[i].value);
            }
        }
        return result;
    }
};

int main() {
    SparseMatrix matrix;

    // Set some values
    matrix.set(1, 2, 3.5);
    matrix.set(0, 0, 2.2);
    matrix.set(1, 2, 0); // remove element at (1,2)

    cout << "Value at (1,2): " << matrix.get(1, 2) << endl;
    cout << "Value at (0,0): " << matrix.get(0, 0) << endl;
    cout << "Non-zero count: " << matrix.size() << endl;

    // Add more values for testing
    matrix.set(2, 3, 4.4);
    matrix.set(4, 5, 5.5);

    cout << "Non-zero entries:" << endl;
    for (const auto& elem : matrix) {
        cout << "  (" << elem.row << ", " << elem.col << ") = " << elem.value << endl;
    }

    // Test transpose
    SparseMatrix transposed = matrix.transpose();

    cout << "Transposed entries:" << endl;
    for (const auto& elem : transposed) {
        cout << "  (" << elem.row << ", " << elem.col << ") = " << elem.value << endl;
    }

    return 0;
}
