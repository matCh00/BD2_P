SELECT IF (
(SELECT rented FROM database_course.movies WHERE movieName LIKE "Avatar") = 0, 
1, 
0)